var twitterUsername = /((?:^|\s)@[A-Za-z0-9_]{1,15})\b/;

function processMatching(root, match, callback) {
  var nodes = [];

  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

  while (walker.nextNode())
    if (walker.currentNode.nodeValue.match(match))
      nodes.push(walker.currentNode);

  nodes.forEach(callback);
}

function inAnchor(node) {
  for (var par = node; par; par = par.parentElement)
    if (par.tagName == "A")
      return true;
}

function linkify(node) {
  var txt = node.nodeValue,
      parts = txt.split(twitterUsername);

  // nothing to do if we didn't match
  if (parts.length == 1 && parts[0] == txt) return;

  var par = node.parentElement;

  // return if we're already in a link
  if (inAnchor(par)) return;

  parts.forEach(function(txt) {
    var newNodes = [];
    if (txt.match(twitterUsername)) {
      var prefix = txt.match(/^\s*@/)[0],
          id = txt.substr(prefix.length),
          link = document.createElement('a');
      link.appendChild(document.createTextNode(id));
      link.setAttribute('href', "https://twitter.com/" + id);
      newNodes.push(document.createTextNode(prefix));
      newNodes.push(link);
    } else {
      newNodes.push(document.createTextNode(txt));
    }
    newNodes.forEach(function(newNode) {
      par.insertBefore(newNode, node);
    });
  });

  par.removeChild(node);
}

processMatching(document.body, twitterUsername, linkify);
