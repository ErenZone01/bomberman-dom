// Routing system

export default class Router {
  constructor(routes, containerName) {
    this.container = containerName
    this.routes = routes;
    window.addEventListener("hashchange", () => this.loadPage());
    this.loadPage();
  }

  async loadPage() {
    const path = getHash();
    const route = this.routes.find((r) => r.path === path);
    if (!route) {
      return;
    }
    this.container.innerHTML = "";
    await route.component();
  }
}

// url update handle
export const handleURLChange = () => {
  const currentHash = getHash();
  if (currentHash === "") {
    return;
  }
};

// Route Extraction
export const getHash = () => {
  return window.location.hash.substring(1);
}

export const setHash = (hash) => {
  window.location.hash = hash.toString()
}