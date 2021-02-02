import React, {Component} from "react";

import { Layout } from 'antd';
import HeaderPage from "../../Components/Header";
import getHtmlXhr from "../../Services/getHtmlXhr";
import "./index.scss";
const { Content } = Layout;

class Category extends Component{
    constructor(props) {
        super(props)
        this.state= {
            current: 'thele'
        }
    }
    componentDidMount() {
        getHtmlXhr('page_thele_content' ,'./thele.html')
        this.props.routes.getRouter('thele');
        window.scrollTo(0, 0)
    }
    render() {
        return(
            <>
                <HeaderPage trang={'thele'}/>
                <Content
                    className="site-layout-background wrap_page_content"
                >
                    <div className='col-md-12 page_the_le'>
                        <div className='banner'>
                            <img src={require("../../Asset/Image/banner.png")} alt="Flowers in Chania"/>
                        </div>
                        <div className='page_content content' id='page_thele_content'>
                        </div>
                    </div>
                </Content>
            </>
        );
    }
}

export default Category;