import { PlainTextLogo, PowerShellLogo } from '@avelin/icons/languages'

export type Language = {
  value: string
  name: string
  keywords?: string[]
  logo?: React.ElementType
}

export const languages: Language[] = [
  { value: 'bat', name: 'Batch Script', keywords: ['cmd', 'batch', 'bat'] },
  { value: 'clojure', name: 'Clojure' },
  { value: 'coffee', name: 'CoffeeScript' },
  { value: 'cpp', name: 'C++' },
  { value: 'csharp', name: 'C#' },
  { value: 'csp', name: 'Content Security Policy' },
  { value: 'css', name: 'CSS' },
  { value: 'dockerfile', name: 'Dockerfile' },
  { value: 'fsharp', name: 'F#' },
  { value: 'go', name: 'Go' },
  { value: 'graphql', name: 'GraphQL' },
  { value: 'handlebars', name: 'Handlebars' },
  { value: 'html', name: 'HTML' },
  { value: 'ini', name: 'INI' },
  { value: 'java', name: 'Java' },
  { value: 'javascript', name: 'JavaScript' },
  { value: 'json', name: 'JSON' },
  { value: 'kotlin', name: 'Kotlin' },
  { value: 'less', name: 'LESS' },
  { value: 'lua', name: 'Lua' },
  { value: 'markdown', name: 'Markdown' },
  {
    value: 'msdax',
    name: 'DAX',
    keywords: ['msdax', 'dax', 'data analysis expressions'],
  },
  { value: 'mysql', name: 'MySQL' },
  { value: 'objective-c', name: 'Objective-C' },
  { value: 'pascal', name: 'Pascal' },
  { value: 'perl', name: 'Perl' },
  { value: 'pgsql', name: 'PostgreSQL' },
  { value: 'php', name: 'PHP' },
  { value: 'plaintext', name: 'Plain Text', logo: PlainTextLogo },
  { value: 'postiats', name: 'ATS (Applied Type System)' },
  { value: 'powerquery', name: 'Power Query' },
  {
    value: 'powershell',
    name: 'PowerShell',
    keywords: ['powershell', 'ps', 'pwsh', 'ps1'],
    logo: PowerShellLogo,
  },
  { value: 'pug', name: 'Pug (formerly Jade)' },
  { value: 'python', name: 'Python', keywords: ['python', 'py'] },
  { value: 'r', name: 'R' },
  { value: 'razor', name: 'Razor (CSHTML)' },
  { value: 'redis', name: 'Redis' },
  { value: 'redshift', name: 'Redshift SQL' },
  { value: 'restructuredtext', name: 'reStructuredText' },
  { value: 'ruby', name: 'Ruby' },
  { value: 'rust', name: 'Rust' },
  { value: 'sb', name: 'Small Basic' },
  { value: 'scheme', name: 'Scheme' },
  { value: 'scss', name: 'SCSS' },
  { value: 'shell', name: 'Bash', keywords: ['shell', 'sh', 'bash'] },
  { value: 'sol', name: 'Solidity (Ethereum)' },
  { value: 'sql', name: 'SQL' },
  { value: 'st', name: 'Structured Text' },
  { value: 'swift', name: 'Swift' },
  { value: 'typescript', name: 'TypeScript', keywords: ['typescript', 'ts'] },
  { value: 'vb', name: 'Visual Basic' },
  { value: 'xml', name: 'XML' },
  { value: 'yaml', name: 'YAML' },
] as const

export const LOGOUT_ACTION_TOAST_ID = 'logout-action'

export const ROOM_PATH_REGEX =
  /^\/(?!$|login$|signup$|dashboard$)[A-Za-z0-9_-]+$/
