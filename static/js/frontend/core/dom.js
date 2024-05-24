// virtual dom

// creation of a function that create an html element and add it to the body or a given element

export const newElem = (tag, attributes, parent, textContent = "") => {

  const element = document.createElement(tag);

  let bgColor = ``
  let fontColor = ``

  if (typeof attributes === "object" && attributes !== null) {
    for (let [attrName, attrValue] of Object.entries(attributes)) {
      // handling event in an element
      if (attrName.startsWith("on")) {
        // //console.log(attrName, attrValue);
        const eventType = attrName.substring(2).toLocaleLowerCase();
        element.addEventListener(eventType, attrValue);
      }
      // handling button feature(default and other)
      if (tag == "button" && attrName == "base") {
        attrName = "style"
        if (attrValue == "default") {
          bgColor = "#3498db;"
          fontColor = "#fff"
        } else {
          // e.g: attrValue == "background_Color::font_Color"
          bgColor = attrValue.split("::")[0]
          fontColor = attrValue.split("::")[1]
        }

        let buttonStyle = `
              padding: 10px 20px;
               background-color: {{bgColor}};
               color: {{fontColor}};
               border: 1px solid;
               border-radius: 5px;
               box-shadow: 0 4px 6px rgba(0, 0, 0, 3);
               cursor: pointer;
               transition: background-color 0.3s, color 0.3s, transform 0.2s ease-out, box-shadow 0.2s;
        `
        buttonStyle = buttonStyle.replace("{{bgColor}}", bgColor)
        buttonStyle = buttonStyle.replace("{{fontColor}}", fontColor)

        attrValue = buttonStyle

      }
      element.setAttribute(attrName, attrValue);
    }
  }

  const target = parent;

  if (target) target.appendChild(element);

  element.textContent = textContent;

  return element;
};

// creation of a function  that will generate all the elements according to the json
export const moreElems = (familyData, parent) => {
  const { tag, attributes, children, textContent } = familyData;
  const target = parent || document.body;
  const element = newElem(tag, attributes, target, textContent);

  if (children && Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "object") {
        moreElems(child, element);
      }
    });
  }
  return element;
};

export const elemID = (id) => {
  const element = document.getElementById(id);
  return element
}

export const elemClassName = (className) => {
  const element = document.getElementsByClassName(className)
  return element
}

export const selector = (selectorName) => {
  const element = document.querySelector(selectorName)
  return element
}

export const selectorAll = (selectorName) => {
  const element = document.querySelectorAll(selectorName)
  return element
}

export const removeElem = (elem) => {
  const elemHTML = selector(elem)
  if (elemHTML) {
    elemHTML.remove()
  }
}