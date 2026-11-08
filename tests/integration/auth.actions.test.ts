import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { registerUser } from "@/app/actions/auth.actions";

const prisma = new PrismaClient();

const PASSWORD = "password123";
const EMAIL_PREFIX = "action_register";

function buildFormData(
  overrides: Partial<{
    email: string;
    username: string;
    password: string;
  }> = {},
) {
  const fields = {
    email: `${EMAIL_PREFIX}@mdd.dev`,
    username: "action_register_user",
    password: PASSWORD,
    ...overrides,
  };

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
  return formData;
}

async function cleanup() {
  await prisma.user.deleteMany({
    where: { email: { startsWith: EMAIL_PREFIX } },
  });
}

beforeAll(cleanup);

afterAll(async () => {
  await cleanup();
  await prisma.$disconnect();
});

beforeEach(() => {
  // L'action logge beaucoup : on garde la sortie des tests lisible
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("registerUser : validation", () => {
  it.each([
    ["un email invalide", { email: "pas-un-email" }],
    ["un username trop court", { username: "ab" }],
    ["un mot de passe trop court", { password: "short" }],
  ])("devrait refuser %s", async (_label, overrides) => {
    const result = await registerUser(buildFormData(overrides));

    expect(result).toMatchObject({
      success: false,
      error: expect.any(String),
    });
  });
});

describe("registerUser : succès", () => {
  it("devrait créer l'utilisateur avec un mot de passe haché", async () => {
    const result = await registerUser(buildFormData());

    expect(result).toMatchObject({
      success: true,
      userId: expect.any(String),
    });

    const user = await prisma.user.findUnique({
      where: { email: `${EMAIL_PREFIX}@mdd.dev` },
    });

    expect(user).not.toBeNull();
    expect(user!.password).not.toBe(PASSWORD);
    expect(await bcrypt.compare(PASSWORD, user!.password)).toBe(true);
  });
});

describe("registerUser : doublons", () => {
  const DUP_EMAIL = `${EMAIL_PREFIX}_dup@mdd.dev`;
  const DUP_USERNAME = "action_register_dup_user";
  const DUPLICATE_ERROR = {
    success: false,
    error: "Cet email ou ce nom d'utilisateur est déjà utilisé.",
  };

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        email: DUP_EMAIL,
        username: DUP_USERNAME,
        password: await bcrypt.hash(PASSWORD, 10),
      },
    });
  });

  it("devrait refuser un email déjà utilisé", async () => {
    const result = await registerUser(
      buildFormData({ email: DUP_EMAIL, username: "autre_username" }),
    );

    expect(result).toEqual(DUPLICATE_ERROR);
  });

  it("devrait refuser un username déjà utilisé", async () => {
    const result = await registerUser(
      buildFormData({
        email: `${EMAIL_PREFIX}_autre@mdd.dev`,
        username: DUP_USERNAME,
      }),
    );

    expect(result).toEqual(DUPLICATE_ERROR);
  });
});

describe("registerUser : erreur inattendue", () => {
  it("devrait renvoyer une erreur générique", async () => {
    vi.spyOn(bcrypt, "hash").mockRejectedValueOnce(new Error("boom"));

    const result = await registerUser(
      buildFormData({
        email: `${EMAIL_PREFIX}_erreur@mdd.dev`,
        username: "action_register_erreur",
      }),
    );

    expect(result).toEqual({
      success: false,
      error: "Une erreur est survenue lors de l'inscription.",
    });
  });
});
