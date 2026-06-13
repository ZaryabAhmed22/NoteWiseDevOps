export const sanitizeHtml = (html) => {
  if (!html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const allowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
    'ul', 'ol', 'li', 'span', 'pre', 'code', 'blockquote', 'div'
  ];
  
  const cleanElement = (el) => {
    const children = Array.from(el.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tagName = child.tagName.toLowerCase();
        
        if (!allowedTags.includes(tagName)) {
          // If not an allowed tag, replace it with its text content
          const textNode = document.createTextNode(child.textContent);
          el.replaceChild(textNode, child);
        } else {
          // To be 100% safe from XSS, we remove ALL attributes (like onerror, onclick, style, class, etc)
          const attrs = Array.from(child.attributes);
          for (const attr of attrs) {
            child.removeAttribute(attr.name);
          }
          // Recursively clean children
          cleanElement(child);
        }
      }
    }
  };
  
  cleanElement(doc.body);
  return doc.body.innerHTML;
};
