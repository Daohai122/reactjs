import { CHANGEURL } from "../Actions/ChangeUrl";
const ChangeMennu = (curent = '', action) => {
  switch (action.type) {
    case CHANGEURL:
      return curent
    default:
      return curent
  }
}
export { ChangeMennu };