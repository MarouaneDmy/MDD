import { getAllTopics } from "@/app/actions/article.actions";
import CreateArticleForm from "@/app/components/articles/CreateArticleForm";

export default async function CreateArticlePage() {
  const topics = await getAllTopics();

  return <CreateArticleForm topics={topics} />;
}
