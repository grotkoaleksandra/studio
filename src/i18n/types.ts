export interface Dictionary {
  metadata: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    about: string;
    work: string;
    contact: string;
    signIn: string;
    intranet: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      cta: string;
    };
    projects: {
      title: string;
      viewAll: string;
      items: {
        title: string;
        category: string;
        year: string;
      }[];
    };
    philosophy: {
      title: string;
      description: string;
    };
    contact: {
      heading: string;
      cta: string;
    };
  };
  about: {
    title: string;
    description: string;
    history: {
      title: string;
      content: string;
    };
  };
  programs: {
    title: string;
    description: string;
    list: {
      title: string;
      description: string;
    }[];
  };
  contact: {
    title: string;
    description: string;
    form: {
      name: string;
      email: string;
      message: string;
      submit: string;
    };
  };
  footer: {
    rights: string;
    language: string;
  };
}
