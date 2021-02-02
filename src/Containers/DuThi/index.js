import React, { Component } from "react";
import ListCauHoi from "./DapAn";
import { Checkbox } from 'antd';
import { Layout, Form, Input, Radio, Button, Modal, Select } from 'antd';
import { toast } from 'react-toastify';
import { Base64 } from 'js-base64';
import axios from "axios";
import "./index.scss";
import moment from "moment";
import HeaderPage from "../../Components/Header";
import { Link } from "react-router-dom";
import getHtmlXhr from "../../Services/getHtmlXhr";

const { Content } = Layout;
const configHeader = 
    {
        'X-Requested-With': 'XMLHttpRequest',
        "X-APP-CODE": 'tndhdbnb',
        "X-ENV": 'product',
        'X-MODE': 'create',
        'X-CALLBACK': 'callbackUrl',
        'X-TOKEN': 'ddd',
        'X-INJECT-CURRENT-TIME': 'bat_dau'
    }
function isNormalInteger(str) {
    str = str.trim();
    if (!str) {
        return false;
    }
    str = str.replace(/^0+/, "") || "0";
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n > 0 && n < 100000000;
}
class Detail extends Component {
    today;
    trang;
    constructor(props) {
        super(props);
        this.myRefInfor = React.createRef()
        this.state = {
            ListCauHoi: ListCauHoi.slice(0),
            InforUser: {
                ho_ten: '',
                gioi_tinh: '',
                dia_chi: '',
                sdt: '',
                email: '',
                don_vi: ''
            },
            sdtErr: false,
            emailErr: false,
            showModalConfirm: false,
            linkUrl: '',
            numberRequest: '',
            errnumberRequest: null,
            successFull: false,
            showQuestion: false,
            current: 'duthi',
            dangLam: false,
            comfirmChuyenTrang: false,
            disableSend: false,
            showTime: false,
            serverTime: null,
            showPage: true,
            onReady: false
        }
        this.selectOK = this.selectOK.bind(this);
        this.changeInforUser = this.changeInforUser.bind(this);
        this.sendPostData = this.sendPostData.bind(this);
        this.handerChangeNumber = this.handerChangeNumber.bind(this);
        // this.hideModal = this.hideModal.bind(this);
    }
    selectOK(cau, dapAn, e) {
        let data = this.state.ListCauHoi;
        data[cau].traLoi[dapAn] = e.target.checked;
        if (e.target.checked) {
            data[cau].err = false;
        }
        this.setState({
            ListCauHoi: data,
            dangLam: true
        })
    }
    changeInforUser(value, name) {
        if (name === 'sdt') {
            this.setState({
                sdtErr: false
            });
        }
        if (name === 'email') {
            this.setState({
                emailErr: false
            });
        }
        this.setState(state => ({
            InforUser: {
                ...state.InforUser,
                [name]: value
            },
            dangLam: true
        }));

    }
    validatePhone(phone) {
        if (!phone) {
            return true;
        }
        const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4,5})$/;
        this.setState({
            sdtErr: !regex.test(phone)
        });
        return regex.test(phone);
    }
    validateEmail(email) {
        if (!email) {
            return true;
        }
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.setState({
            emailErr: !re.test(String(email).toLowerCase())
        })
        return re.test(String(email).toLowerCase());
    }
    checkValidateUser() {
        const checkPhone = this.validatePhone(this.state.InforUser.sdt);
        const checkEmail = this.validateEmail(this.state.InforUser.email);
        return checkPhone && checkEmail
    }
    ValidateQuestion() {
        let data = this.state.ListCauHoi.slice(0);
        let status = true;
        data.map((e) => {
            let chuaTraLoi = false;
            Object.keys(e.traLoi).forEach(key => {
                if (e.traLoi[key]) {
                    chuaTraLoi = true
                }
            });
            e.err = !chuaTraLoi;
            if (!chuaTraLoi) {
                status = false
            }
        });
        let errnumberRequest = '';
        if (!this.state.numberRequest) {
            status = false;
            errnumberRequest = 'Bạn chưa nhập số người trả lời đúng!'
        } else {
            if (!isNormalInteger(this.state.numberRequest)) {
                status = false
                errnumberRequest = 'Số người dự đoán phải là số nguyên dương và nhỏ hơn 100 000 000!'
            }
        }
        this.setState({ ListCauHoi: data, errnumberRequest });
        return status;
    }
    onClickTiepTuc() {
        const checkValidateInfor = this.checkValidateUser();
        if (!checkValidateInfor) {
            window.scrollTo(0, this.myRefInfor.current.offsetTop - 70)
            return
        }
        if (!this.state.InforUser.ho_ten || !this.state.InforUser.don_vi || !this.state.InforUser.sdt) {
            this.setState({
                showModalConfirm: true
            }, () => window.scrollTo(0, this.myRefInfor.current.offsetTop - 70));
            return;
        }
        this.setState({showQuestion: true, showTime: true}, () => setTimeout(() => {
            this.countTime();
            this.fnTimeoutGetUrl();
        }, 100))
    }
    onSubmit() {
        this.setState({
            disableSend: true
        })
        if (!this.ValidateQuestion()) {
            toast.warning('Vui lòng trả lời hết câu hỏi!', {
                position: toast.POSITION.TOP_RIGHT
            });
            this.setState({
                disableSend: false
            })
            return;
        }
        this.sendPostData();
    }

    hideModal = (noScroll) => {
        this.setState({
            showModalConfirm: false
        }, () => !noScroll && window.scrollTo(0, this.myRefInfor.current.offsetTop - 70)
        );
    }
    async getUrlRequest() {
        try {
            // eslint-disable-next-line no-undef
            if(!window.grecaptcha && typeof(window.grecaptcha.execute) != 'function') {
                console.log('co vao');
                setTimeout(() => {
                    this.fnTimeoutGetUrl();
                }, 1000);
                return;
            }
            const tokenCapcha = await window.grecaptcha.execute('6LeDPtQZAAAAAEz0owp1YBguKx9yDJ1sNSNo9WSh', {action: 'submit'});
            configHeader['X-TOKEN'] = tokenCapcha;
            console.log('tokenCapcha', tokenCapcha)
            this.today = moment().format();
            const body = Base64.toBase64(JSON.stringify({ "bat_dau": this.today }));
            const res = await axios({
                url: '//serverless.survey.siten.vn/get-link',
                method: 'post',
                data: body,
                headers: configHeader
            });
            console.log('ressssgetlink', res)
            if (res && res.data && res.data.result && res.data.result.submitUrl) {
                this.setState({
                    linkUrl: res.data.result.submitUrl,
                    serverTime: res.data.result.serverTime
                })
            } else {
                toast.error('Không thể khởi tạo bài thi!', {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } catch (error) {
            console.log('err', error)
            setTimeout(() => {
                this.fnTimeoutGetUrl();
            }, 2000);
            toast.error('Không thể khởi tạo bài thi! Vui lòng kiểm tra kết nối internet.', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }
    async sendPostData() {
        try {
            this.hideModal(true);
            let dataBody = {
                surveyId: window.serveyId,
                result: [],
                callbackUrl: "",
                appCode: "tndhdbnb"
            };
            Object.keys(this.state.InforUser).forEach(key => {
                dataBody.result.push({ code: key, value: this.state.InforUser[key] })
            });
            this.state.ListCauHoi.forEach((e, i) => {
                const dataSelect = [];
                Object.keys(e.traLoi).forEach(key => {
                    if (e.traLoi[key]) {
                        dataSelect.push(key)
                    }
                });
                dataBody.result.push({ code: "cau_" + (i + 1), value: dataSelect.join('\n') })
            })
            const boSung = [
                { "code": "du_doan", "value": this.state.numberRequest },
                { "code": "bat_dau", "value": this.state.serverTime }
            ]
            dataBody.result = dataBody.result.concat(boSung);
            configHeader['X-TOKEN'] = 'ok';
            const res = await axios({
                url: this.state.linkUrl,
                method: 'post',
                data: dataBody,
                headers: configHeader
            });
            if (res && res.data && res.data.result) {
                this.clearData();
                toast.success('Gửi bài thi thành công!', {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.error('Không thể gửi kết quả bài thi!', {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            this.setState({
                disableSend: true
            })
        } catch (error) {
            this.setState({
                disableSend: false
            })
            toast.error('Không thể gửi kết quả bài thi!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }
    getRandomArbitrary(min, max) {
        return Math.round(Math.random() * (max - min) + min);
      }

    clearTimeCount;
    clearTimeCountRepet;
    countTime() {
        let _this = this;
        var $worked = document.getElementById('time');
        function update() {
            if(_this.state.successFull){return;};
            var myTime = $worked.innerText;
            var ss = myTime.split(":");
            var dt = new Date();
            dt.setHours(0);
            dt.setMinutes(ss[0]);
            dt.setSeconds(ss[1]);
            
            var dt2 = new Date(dt.valueOf() + 1000);
            var temp = dt2.toTimeString().split(" ");
            var ts = temp[0].split(":");
            
            $worked.innerText = ts[1]+":"+ts[2];
            this.clearTimeCountRepet = setTimeout(update, 1000);
        }
        this.clearTimeCount = setTimeout(update, 1000);
    }
    
    async componentDidMount() {
        this.getInfor();
        // this.getUrlRequest()
        window.scrollTo(0, 0)
    }
    timeoutGetUrl;
    fnTimeoutGetUrl() {
        this.getUrlRequest();
    }
    componentWillUnmount() {
        clearTimeout(this.timeoutGetUrl);
        this.clearTimeCount&&clearTimeout(this.clearTimeCount);
        this.clearTimeCountRepet&&clearTimeout(this.clearTimeCountRepet);
    }

    clearData(chuaHoanThanh) {
        let data = this.state.ListCauHoi.slice(0);
        data.map(e => {
            e.traLoi = { A: false, B: false, C: false, D: false }
        });
        this.clearTimeCount&&clearTimeout(this.clearTimeCount);
        this.clearTimeCountRepet&&clearTimeout(this.clearTimeCountRepet);
        
        this.setState({
            successFull: chuaHoanThanh? false: true,
            ListCauHoi: data,
            numberRequest: '',
            dangLam: false,
        });
    }
    handerChangeNumber(value) {
        this.setState({
            numberRequest: value,
            errnumberRequest: !isNormalInteger(value) ? "Số người dự đoán phải là số nguyên dương và nhỏ hơn 100 000 000!" : '',
            dangLam: true
        });
    }
    directOther = (e, trang) => {
        this.trang = trang;
        e.preventDefault();
        if (this.state.dangLam && !this.state.successFull) {
            this.setState({
                comfirmChuyenTrang: true
            })
        } else {
            this.props.history.push(trang)
        }
    }
    Lamlai = (e) =>  {
        e.preventDefault()
        this.setState({
            successFull: false,
            dangLam: false,
            disableSend: false,
            showQuestion: true
        });
    }
    getInfor = async() => {
        console.log('window.serveyId', window.serveyId)
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
                this.setState({
                    onReady: true
                });
                if(serverTime < startTime) {
                    this.setState({
                        showPage: false
                    }, ()=> setTimeout(() => {
                        getHtmlXhr('content_duthi', 'chua-bat-dau.html');
                    }, 50))
                } 
                if(serverTime > endTime) {
                    this.setState({
                        showPage: false
                    }, ()=> setTimeout(() => {
                        getHtmlXhr('content_duthi', 'ket-thuc.html');;
                    }, 50))
                }
            }
        } catch (err) {
            console.warning(err)
        }
    }

    render() {
        return (
            <>
                <HeaderPage directOther={this.directOther} trang={'duthi'}/>
                {this.state.showTime&&<div className={'time'} id='time'>
                    00:00
                </div>}
                <Content className="site-layout-background wrap_page_content">
                    <div className='col-md-12 page_cau_hoi'>
                        <div className='banner'>
                            <img src={require("../../Asset/Image/banner.png")} alt="Flowers in Chania" />
                        </div>
                        {!this.state.showPage ? <div className='page_content content' id='content_duthi'></div>
                        :<>
                        {this.state.onReady ? <>
                            {this.state.successFull ?
                            <div className='page_content content wrap_success_thi'>
                                <div className="success_thi">
                                    <p className="title">Cảm ơn bạn đã gửi bài dự thi!</p>
                                    <p>Kết quả sẽ được cập nhật sau khi kết thúc đợt thi.</p>
                                    <p>Mời bạn theo dõi để biết thêm thông tin chi tiết.</p>
                                    <p className='des'>Các thí sinh có thể tham dự thi nhiều lần và sẽ xét trao giải dựa trên bài thi có thành tích tốt nhất.<br/>Bạn có thể <Link to='/duthi' onClick={(e) => this.Lamlai(e)}>click vào đây</Link> để dự thi thêm lượt nữa.</p>
                                    <p className="ky_footer">Ban tổ chức cuộc thi</p>
                                </div>
                            </div>
                            :
                            <div className='page_content content'>
                                {!this.state.showQuestion ?
                                    <>
                                        <div ref={this.myRefInfor}>
                                            <p className="title">I. THÔNG TIN CÁ NHÂN</p>
                                            <p style={{marginBottom: 5, color: '#5d5d5d' }}>Các trường thông tin có dấu <span style={{fontSize: 16, color: 'red'}}>*</span> là bắt buộc để bài thi được xét trao giải.</p>
                                            <Form layout={'vertical'}>
                                                <Form.Item label="Họ và tên" className="required">
                                                    <Input value={this.state.InforUser.ho_ten} onChange={(e) => this.changeInforUser(e.target.value, 'ho_ten')} placeholder="Nhập họ tên" />
                                                </Form.Item>
                                                <Form.Item label="Số điện thoại" className="required">
                                                    <Input type='number' value={this.state.InforUser.sdt} onChange={(e) => this.changeInforUser(e.target.value, 'sdt')} placeholder="Nhập số điện thoại" />
                                                    {this.state.sdtErr && <p className="erroMessenger">{'Bạn nhập sai số điện thoại!'}</p>}
                                                </Form.Item>
                                                <Form.Item label="Đơn vị dự thi" className="required">
                                                    <Input value={this.state.InforUser.don_vi} onChange={(e) => this.changeInforUser(e.target.value, 'don_vi')} placeholder="Chọn trong danh sách hoặc nhập nếu không có" list="browsers" name="browser" id="browser" />
                                                    <datalist id="browsers">
                                                        <option value="Thành phố Ninh Bình" />
                                                        <option value="Thành phố Tam Điệp" />
                                                        <option value="Huyện Nho Quan" />
                                                        <option value="Huyện Gia Viễn" />
                                                        <option value="Huyện Hoa Lư" />
                                                        <option value="Huyện Yên Mô" />
                                                        <option value="Huyện Yên Khánh" />
                                                        <option value="Huyện Kim Sơn" />
                                                        <option value="Quân sự tỉnh Ninh Bình" />
                                                        <option value="Công an tỉnh Ninh Bình" />
                                                        <option value="Biên phòng tỉnh Ninh Bình" />
                                                        <option value="Khối cơ quan và Doanh nghiệp tỉnh" />
                                                    </datalist>
                                                </Form.Item>
                                                <Form.Item label="Địa chỉ liên hệ">
                                                    <Input value={this.state.InforUser.dia_chi} onChange={(e) => this.changeInforUser(e.target.value, 'dia_chi')} placeholder="Nhập địa chỉ liên hệ" />
                                                </Form.Item>
                                                <Form.Item label="Giới tính">
                                                    <Radio.Group onChange={(e) => this.changeInforUser(e.target.value, 'gioi_tinh')} value={this.state.InforUser.gioi_tinh}>
                                                        <Radio value={'Nam'}>Nam</Radio>
                                                        <Radio value={"Nữ"}>Nữ</Radio>
                                                        <Radio value={"Khác"}>Khác</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                                <Form.Item label="Email">
                                                    <Input value={this.state.InforUser.email} onChange={(e) => this.changeInforUser(e.target.value, 'email')} placeholder="Nhập địa chỉ email" />
                                                    {this.state.emailErr && <p className="erroMessenger">{'Bạn nhập sai email!'}</p>}
                                                </Form.Item>
                                            </Form>
                                        </div>
                                        <div className='col-md-12' style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Button type="primary" onClick={() => this.onClickTiepTuc()} style={{ marginTop: 16 }}>
                                                Vào thi
                                            </Button>
                                        </div>
                                    </>
                                    :
                                    <div>
                                        <p className="title">II. TRẢ LỜI CÂU HỎI</p>
                                        {this.state.ListCauHoi.map((e, i) => {
                                            return (
                                                <div key={i} className='wrap_cau_hoi'>
                                                    <b>{e.title}</b>
                                                    <div className='wrap_dap_an'>
                                                        {Object.keys(e.listDapAn).map(key => {
                                                            return <div className='col-md-12' key={key}><Checkbox checked={e.traLoi[key]} onChange={(e) => this.selectOK(i, key, e)} >{e.listDapAn[key]}</Checkbox></div>
                                                        })}
                                                    </div>
                                                    {e.err && <p className="erroMessenger">{'Vui lòng trả lời câu hỏi!'}</p>}
                                                </div>
                                            )
                                        })}
                                        <div className='wrap_cau_hoi'>
                                            <b>Dự đoán của bạn: Có bao nhiêu người trả lời đúng tất cả các câu hỏi ở trên?</b>
                                            <div className='wrap_dap_an'>
                                                <Input type='number' min={1} value={this.state.numberRequest} onChange={(e) => this.handerChangeNumber(e.target.value)} placeholder="Dự đoán số người trả lời đúng" />
                                            </div>
                                            {this.state.errnumberRequest && <p className="erroMessenger">{this.state.errnumberRequest}</p>}
                                            <div className='col-md-12' style={{marginTop: '10px'}}>
                                           
                                        </div>
                                        </div>
                                        
                                        {this.state.linkUrl && <div className='col-md-12' style={{ display: 'flex', justifyContent: 'center' }}>
                                        
                                            <Button disabled={this.state.disableSend} type="primary" onClick={() => this.onSubmit()}>
                                                Hoàn thành
                                    </Button>
                                        </div>}
                                    </div>
                                }
                            </div>}
                        </>: <div className='page_content content wrap_success_thi'></div>}</>
                        }
                    </div>
                    <Modal
                        closable={false}
                        maskClosable={false}
                        title="Thông báo"
                        visible={this.state.showModalConfirm}
                        onOk={() => this.hideModal()}
                        onCancel={() => { this.setState({showQuestion: true, showModalConfirm: false, showTime: true}, () => setTimeout(() => {
                            this.countTime();
                            this.fnTimeoutGetUrl();
                        }, 100))}}
                        okText="Nhập thông tin"
                        okType='primary'
                        cancelText="Vào thi"
                    >
                        <p>Bạn chưa nhập đủ thông tin cá nhân bắt buộc!<br/> Bài dự thi của bạn sẽ không được xét để trao thưởng. Bài thi chỉ được xét trao thưởng khi người dự thi điền đủ thông tin Họ và tên, Số điện thoại và đơn vị dự thi.
                    </p>
                    </Modal>
                    <Modal
                        closable={false}
                        maskClosable={false}
                        title="Thông báo"
                        visible={this.state.comfirmChuyenTrang}
                        onOk={() => {this.clearData(true); this.props.history.push(this.trang)}}
                        onCancel={() => this.setState({ comfirmChuyenTrang: false })}
                        okText="Tiếp tục"
                        okType='primary'
                        cancelText="Huỷ"
                    >
                        <p>Bạn đang làm dở bài thi! Bạn có chắc chắn chuyển trang? </p>
                    </Modal>
                </Content>
            </>
        );
    }
}

export default Detail;

