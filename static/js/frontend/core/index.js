import { event } from "./event.js";
import Router, { setHash } from "./routes.js";
import { elemClassName, elemID, newElem, removeElem, selector, selectorAll } from "./dom.js"
import { moreElems } from "./dom.js";
import { getHash } from "./routes.js"
import { filterByClass, updateClassById, deleteCompleted } from "./states.js";


const miniHelp = {
    Router,
    event,
    moreElems,
    getHash,
    filterByClass,
    updateClassById,
    deleteCompleted,
    newElem,
    elemID,
    elemClassName,
    selector,
    selectorAll,
    setHash,
    removeElem,
}

export default miniHelp