import { call} from "redux-saga/effects";

import { watchChangeUrl} from "./changeUrl";

export default function* RootSaga() {
    yield call(
        watchChangeUrl,
    )
}