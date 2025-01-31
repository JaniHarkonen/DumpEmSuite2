type OnDirectoryOpen = (path: string) => void;
type OnFileOpen = (path: string) => void;
type OnLinkOpen = (link: string) => void;

type Returns = {
  openFile: OnFileOpen;
  openDirectory: OnDirectoryOpen;
  openLink: OnLinkOpen;
};

const {filesAPI} = window.api;

export default function useExternalLinks(): Returns {

  const openFile = (path: string) => {
    filesAPI.execute({ command: '"' + path + '"' });
  };

  const openDirectory = (path: string) => {
    filesAPI.execute({ command: 'explorer "' + path + '"' });
  };
  
  const openLink = (link: string) => {
      // Check if the link has the protocol in front of it, if not, append it
    if( !link.startsWith("https://") && !link.startsWith("http://") ) {
      link = "https://" + link;
    }

    filesAPI.execute({ command: 'explorer "' + link + '"' });
  };
  
  return {
    openFile,
    openDirectory,
    openLink
  };
}
