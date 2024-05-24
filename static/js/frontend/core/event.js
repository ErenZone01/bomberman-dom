// creation of a function that create eventlistner

export const event = (deed, element, handler) => {
    element.addEventListener(deed, handler);
};