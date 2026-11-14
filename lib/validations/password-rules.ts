export const PASSWORD_RULES = [
  {
    id: "length",
    label: "8 caractères minimum",
    message: "Le mot de passe doit contenir au moins 8 caractères",
    test: (value: string) => value.length >= 8,
  },
  {
    id: "uppercase",
    label: "Une majuscule",
    message: "Le mot de passe doit contenir au moins une majuscule",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "digit",
    label: "Un chiffre",
    message: "Le mot de passe doit contenir au moins un chiffre",
    test: (value: string) => /\d/.test(value),
  },
  {
    id: "special",
    label: "Un caractère spécial",
    message: "Le mot de passe doit contenir au moins un caractère spécial",
    // Ponctuation ASCII : ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~
    test: (value: string) => /[!-\/:-@[-`{-~]/.test(value),
  },
] as const;
