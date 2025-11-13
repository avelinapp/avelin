import {
  BashLogo,
  BatchScriptLogo,
  CPlusPlusLogo,
  CSSLogo,
  DockerLogo,
  GoLogo,
  GraphQLLogo,
  HTMLLogo,
  JavaLogo,
  JavascriptLogo,
  JSONLogo,
  LuaLogo,
  MarkdownLogo,
  ObjectiveCLogo,
  PascalLogo,
  PerlLogo,
  PHPLogo,
  PlainTextLogo,
  PostgreSQLLogo,
  PowerShellLogo,
  PythonLogo,
  RLogo,
  RubyLogo,
  RustLogo,
  SassLogo,
  SchemeLogo,
  TypescriptLogo,
  XMLLogo,
  YamlLogo,
} from '@avelin/icons/languages'

export type Language = {
  value: string
  name: string
  keywords?: string[]
  logo?: React.ElementType
}

export const languages: Language[] = [
  {
    value: 'bat',
    name: 'Batch Script',
    keywords: ['cmd', 'batch', 'bat'],
    logo: BatchScriptLogo,
  },
  // { value: 'clojure', name: 'Clojure' },
  // { value: 'coffee', name: 'CoffeeScript' },
  { value: 'cpp', name: 'C++', logo: CPlusPlusLogo },
  // { value: 'csharp', name: 'C#' },
  // { value: 'csp', name: 'Content Security Policy' },
  { value: 'css', name: 'CSS', logo: CSSLogo },
  { value: 'dockerfile', name: 'Dockerfile', logo: DockerLogo },
  // { value: 'fsharp', name: 'F#' },
  { value: 'go', name: 'Go', logo: GoLogo },
  { value: 'graphql', name: 'GraphQL', logo: GraphQLLogo },
  // { value: 'handlebars', name: 'Handlebars' },
  { value: 'html', name: 'HTML', logo: HTMLLogo },
  // { value: 'ini', name: 'INI' },
  { value: 'java', name: 'Java', logo: JavaLogo },
  { value: 'javascript', name: 'JavaScript', logo: JavascriptLogo },
  { value: 'json', name: 'JSON', logo: JSONLogo },
  // { value: 'kotlin', name: 'Kotlin' },
  // { value: 'less', name: 'LESS' },
  { value: 'lua', name: 'Lua', logo: LuaLogo },
  { value: 'markdown', name: 'Markdown', logo: MarkdownLogo },
  // {
  //   value: 'msdax',
  //   name: 'DAX',
  //   keywords: ['msdax', 'dax', 'data analysis expressions'],
  // },
  // { value: 'mysql', name: 'MySQL', logo: MySQLLogo },
  { value: 'objective-c', name: 'Objective-C', logo: ObjectiveCLogo },
  { value: 'pascal', name: 'Pascal', logo: PascalLogo },
  { value: 'perl', name: 'Perl', logo: PerlLogo },
  // { value: 'pgsql', name: 'PostgreSQL', logo: PostgreSQLLogo },
  { value: 'php', name: 'PHP', logo: PHPLogo },
  { value: 'plaintext', name: 'Plain Text', logo: PlainTextLogo },
  // { value: 'postiats', name: 'ATS (Applied Type System)' },
  // { value: 'powerquery', name: 'Power Query' },
  {
    value: 'powershell',
    name: 'PowerShell',
    keywords: ['powershell', 'ps', 'pwsh', 'ps1'],
    logo: PowerShellLogo,
  },
  // { value: 'pug', name: 'Pug (formerly Jade)' },
  {
    value: 'python',
    name: 'Python',
    keywords: ['python', 'py'],
    logo: PythonLogo,
  },
  { value: 'r', name: 'R', logo: RLogo },
  // { value: 'razor', name: 'Razor (CSHTML)' },
  // { value: 'redis', name: 'Redis' },
  // { value: 'redshift', name: 'Redshift SQL' },
  // { value: 'restructuredtext', name: 'reStructuredText' },
  { value: 'ruby', name: 'Ruby', logo: RubyLogo },
  { value: 'rust', name: 'Rust', logo: RustLogo },
  // { value: 'sb', name: 'Small Basic' },
  { value: 'scheme', name: 'Scheme', logo: SchemeLogo },
  { value: 'scss', name: 'Sass', logo: SassLogo },
  {
    value: 'shell',
    name: 'Bash',
    keywords: ['shell', 'sh', 'bash'],
    logo: BashLogo,
  },
  // { value: 'sol', name: 'Solidity (Ethereum)' },
  { value: 'sql', name: 'SQL', logo: PostgreSQLLogo },
  // { value: 'st', name: 'Structured Text' },
  // { value: 'swift', name: 'Swift' },
  {
    value: 'typescript',
    name: 'TypeScript',
    keywords: ['typescript', 'ts'],
    logo: TypescriptLogo,
  },
  {
    value: 'tsx',
    name: 'TSX',
    keywords: ['tsx', 'react', 'typescript'],
    logo: TypescriptLogo,
  },
  // { value: 'vb', name: 'Visual Basic' },
  { value: 'xml', name: 'XML', logo: XMLLogo },
  { value: 'yaml', name: 'YAML', logo: YamlLogo },
] as const

/**
 * Maps Avelin's language values to Ray.so's language keys.
 * If a language is not present in Ray.so, the value is undefined.
 */
export const AVELIN_TO_RAYSO_LANGUAGE_MAP: Record<string, string | undefined> =
  {
    bat: undefined, // Not present in Ray.so
    cpp: 'cpp',
    css: 'css',
    dockerfile: 'dockerfile',
    go: 'go',
    graphql: 'graphql',
    html: 'html',
    java: 'java',
    javascript: 'javascript',
    json: 'json',
    lua: 'lua',
    markdown: 'markdown',
    'objective-c': 'objectivec', // Avelin uses 'objective-c', Ray.so uses 'objectivec'
    pascal: undefined, // Not present in Ray.so
    perl: undefined, // Not present in Ray.so
    php: 'php',
    plaintext: 'plaintext',
    powershell: 'powershell',
    python: 'python',
    r: 'r',
    ruby: 'ruby',
    rust: 'rust',
    scheme: undefined, // Not present in Ray.so
    scss: 'scss',
    shell: 'shell',
    sql: 'sql',
    typescript: 'typescript',
    tsx: 'tsx',
    xml: 'xml',
    yaml: 'yaml',
  } as const

export const LOGOUT_ACTION_TOAST_ID = 'logout-action'
