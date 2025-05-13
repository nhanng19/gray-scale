function toggleGrayscale(isEnabled) {
    const existing = document.getElementById("grayscale-extension-style");
  
    if (isEnabled && !existing) {
      const style = document.createElement("style");
      style.id = "grayscale-extension-style";
      style.innerText = `
        html {
          filter: grayscale(100%) !important;
          transition: none !important;
        }
      `;
      document.head.appendChild(style);
    } else if (!isEnabled && existing) {
      existing.remove();
    }
  }
  
  toggleGrayscale(true); 
  