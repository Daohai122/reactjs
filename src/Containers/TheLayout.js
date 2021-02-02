import React from "react";
import { Layout } from 'antd';
import { ToastContainer } from 'react-toastify';
import AppNavigation from "../Navigations/AppNavigation";
import History from "../Navigations/History";
import "./Container.scss";
import { ChangeMennu } from "../Redux/Actions";
import { connect } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';

const { Header } = Layout;
class TheLayout extends React.Component {
    state = {
        collapsed: false,
        current: 'duthi',
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    handleClick = e => {
        console.log('click ', e);
        this.setState({ current: e.key });
    };
    componentWillMount() {
        this.unlisten = History.listen((location, action) => {
            console.log("on route change");
        });
    }
    getRouter = (data) => {
        this.setState({
            current: data
        })
    }
    directer = (e) => {
        // e.preventDefault();

    }
    render() {
        return (
            <Layout className="site-layout">
                
                <div className="container_app">
                    <AppNavigation getRouter={this.getRouter} />
                </div>
                <ToastContainer />
                <div className='wrap_footer'>
                    <div className="footer">
                        <p className="title">Đơn vị chủ trì tổ chức cuộc thi: Ban Tuyên giáo Tỉnh ủy Ninh Bình</p>
                        <p className="title">Đơn vị phối hợp: Ban Tổ chức Tỉnh ủy Ninh Bình, Sở Thông tin và Truyền thông Ninh Bình, Báo Ninh Bình, Đài PTTH Ninh Bình,...</p>
                        <p>Hotline: 0913.683.569</p>
                    </div>
                </div>
            </Layout>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        curent: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onChangeMennu: (curent) => {
            dispatch(ChangeMennu(curent));
        }
    }
}

const TheLayoutRedux = connect(mapStateToProps, mapDispatchToProps)(TheLayout);
export default TheLayoutRedux;