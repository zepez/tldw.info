import { GitHubLogoIcon, IdCardIcon } from "@radix-ui/react-icons";

export default function Header() {
  return (
    <div className="flex h-[var(--header-height)] items-center justify-between border-b px-8">
      <h1 className="font-bold">TLDW.info</h1>
      <nav className="flex gap-8">
        <a title="Alexander Zepezauer" href="https://zepez.dev">
          <IdCardIcon className="h-6 w-6" />
        </a>

        <a
          title="Project Source Code"
          href="https://github.com/zepez/tldw.info"
        >
          <GitHubLogoIcon className="h-6 w-6" />
        </a>
      </nav>
    </div>
  );
}
