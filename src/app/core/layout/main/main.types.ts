export interface MainTab {
  tabAlias?: string;
  routerPath?: string;
  text: string;
  icon?: string;
}

export interface MainConfig {
  tabs?: MainTab[];
}
