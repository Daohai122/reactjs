import { CHANGEURL } from "../Redux/Actions/ChangeUrl";
import { put, takeLatest } from "redux-saga/effects";

function* changeUrl(current) {
  yield put({ type: CHANGEURL, user: current });
}

export function* watchChangeUrl() {
  yield takeLatest(CHANGEURL, changeUrl);
}