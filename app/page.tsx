import { promises as fs } from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

async function getReadmeContent() {
  const readmePath = path.join(process.cwd(), 'README.md');
  const content = await fs.readFile(readmePath, 'utf8');
  return content;
}

export default async function Home() {
  const content = await getReadmeContent();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg prose-slate mx-auto">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
