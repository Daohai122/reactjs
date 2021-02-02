import { CHANGEURL } from "./ChangeUrl";

export const ChangeMennu = (curentMenu) => {
    return {
        type: CHANGEURL,
        curentMenu
    }
}