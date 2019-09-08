£27/08/19 fit
============================
fatal: Unable to create '/Users/loganlee/project/portfolio/project/.git/index.lock': File exists.

Another git process seems to be running in this repository, e.g.
an editor opened by 'git commit'. Please make sure all processes
are terminated then try again. If it still fails, a git process
may have crashed in this repository earlier:
remove the file manually to continue. 
============================
I dont know why is this error has happeend. but solution of it was remove .git/index.lock file.
then re-add then commit. 

£15/08/19
I have reached SSL Certification error when server tried to crawl https protocol website.
Thus i impletemented SSL Certification for this server with "ssl-root-cas/latest" lib.
Generating key and pem with SSL function then running server as https protocol as well.
Resultingly, it works well now.

£28/08/19
i've faced charset problem when i try to crawl site which is "Etoland".
they're using EUC-KR charset instead of UTF-8.
Thus any korean that i crawled was broken.
i have to convert or enode when i make a request.
Resolve - used Iconv.decode() function, decode as EUC-KR charset and set ResponseType as 'ArrayBuffer' of Axios.

£03/09/19
i've crawled hot posts on website but they not always provide enough amount of Info to be crawled.
Thus crawl surface first and collect it then get inside one step to get full detail of Info.
