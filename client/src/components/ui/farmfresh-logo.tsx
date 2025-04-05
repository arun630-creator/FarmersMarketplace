import React from "react";
import { Link } from "wouter";

interface LogoProps {
  className?: string;
}

export function FarmFreshLogo({ className = "" }: LogoProps) {
  return (
    <Link href="/">
      <a className={`flex items-center space-x-2 ${className}`}>
        <FarmIcon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold font-heading text-neutral-900">
          Farm<span className="text-primary">Fresh</span>
        </h1>
      </a>
    </Link>
  );
}

function FarmIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 11a4 4 0 11-8 0 4 4 0 018 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 13.5V8.25a.75.75 0 00-.75-.75h-4.5a.75.75 0 00-.75.75v5.25"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.089 10.5L2 12.5V21h20v-8.5l-2.089-2"
      />
    </svg>
  );
}
