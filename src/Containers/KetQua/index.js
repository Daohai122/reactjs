import React, { Component } from "react";
import { Layout } from 'antd';
import "./index.scss";
import axios from "axios";
import moment from "moment";
import getHtmlXhr from "../../Services/getHtmlXhr";
import HeaderPage from "../../Components/Header";
const { Content } = Layout;
class KetQua extends Component {
    constructor(props) {
        super(props)
        this.state= {
        }
    }
    componentDidMount() {
        this.getInfor();
        window.scrollTo(0, 0);
    }
    getInfor = async() => {
        try {
            const res = await axios({
                url: '//serverless.survey.siten.vn/get-info?surveyId=' + window.serveyId,
                method: 'get'
            });
            if(res.data && res.data.result) {
                let {serverTime, startTime, endTime} = res.data.result;
                serverTime = moment(serverTime).valueOf();
                startTime = moment(startTime).valueOf();
                endTime = moment(endTime).valueOf();
                if(serverTime < startTime) {
                    getHtmlXhr('page_ketqua_content', 'ket-qua-chua-bat-dau.html');
                } else if(serverTime > endTime) {
                    getHtmlXhr('page_ketqua_content', 'ket-qua.html');;
                } else {
                    getHtmlXhr('page_ketqua_content', 'ket-qua-dang-thi.html');;
                }
            }
        } catch (err) {
            console.warning(err)
        }
    }
    render() {
        return (
            <>
                <HeaderPage trang={'ketqua'}/>
                <Content
                    className="site-layout-background wrap_page_content"
                >
                    <div className='col-md-12 page_ket_qua'>
                        <div className='banner'>
                            <img src={require("../../Asset/Image/banner.png")} alt="Flowers in Chania" />
                        </div>
                        <div className='page_content content' >
                            <div className='col-md-12 no_ket_qua' id="page_ketqua_content">
                                {/* <p>Kết quả cuộc thi trắc nhiệm tìm hiểu về Đại hội đại biểu Đảng bộ tỉnh Ninh Bình lần thứ XXII (Đợt 1)</p>
                                <p style={{ marginTop: '1.5em' }}>Kết quả chưa cập nhật do đang trong thời gian diễn ra cuộc thi.</p>
                                <p style={{ marginBottom: '4em' }}>Vui lòng dự thi <Link to="/duthi">tại đây</Link></p>
                                <p className='ky'>Ban tổ chức cuộc thi</p> */}
                            </div>
                            {/* <div className='col-md-12'>
                            <p>Kết quả cuộc thi trắc nhiệm tìm hiểu về Đại hội đại biểu Đảng bộ tỉnh Ninh Bình lần thứ XXII (Đợt 1)</p>
                            <div>
                                <b>Giải cá nhân</b>
                                <table style={{width: '100%'}}>
                                    <tr>
                                        <td className='no_boder no_boder_right'></td>
                                        <td className='no_boder'></td>
                                        <td>Dự đoán số người trả lời đúng</td>
                                        <td>Thời gian tham gia</td>
                                    </tr>
                                    <tr >
                                        <td>Giải nhất</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr >
                                        <td>Giải nhì</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td rowSpan={2}>Giải nhì</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td rowSpan={3}>Giải 3</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                  
                                </table>

                            </div>
                            <div>
                                <b>Giải tập thể</b>
                            </div>

                        </div> */}
                        </div>
                    </div>
                </Content>
            </>
        );
    }
}

export default KetQua;