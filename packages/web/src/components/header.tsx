import Link from "next/link";
import { GitHubLogoIcon, IdCardIcon } from "@radix-ui/react-icons";

export default function Header() {
  return (
    <div className="flex h-[var(--header-height)] items-center justify-between border-b px-8">
      <Link title="TLDW.info Homepage" href="/">
        <p className="font-bold">TLDW.info</p>
      </Link>
      <nav className="flex gap-8">
        <Link
          title="Alexander Zepezauer"
          href="https://zepez.dev"
          target="_blank"
        >
          <IdCardIcon className="h-6 w-6" />
        </Link>

        <Link
          title="Project Source Code"
          href="https://github.com/zepez/tldw.info"
          target="_blank"
        >
          <GitHubLogoIcon className="h-6 w-6" />
        </Link>
      </nav>
    </div>
  );
}
