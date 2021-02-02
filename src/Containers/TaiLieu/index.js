import React, {Component} from "react";
import { Layout } from 'antd';
import HeaderPage from "../../Components/Header";
import getHtmlXhr from "../../Services/getHtmlXhr";
const { Content } = Layout;

class TaiLieu extends Component{
    constructor(props) {
        super(props)
        this.state= {
          
        }
    }
    componentDidMount() {
        getHtmlXhr('page_tailieu_content', './tailieu.html')
        window.scrollTo(0, 0)
    }
    render() {
        return(
            <>
                <HeaderPage trang={'tailieu'}/>
                <Content
                    className="site-layout-background wrap_page_content"
                >
                    <div className='col-md-12 page_the_le'>
                        <div className='banner'>
                            <img src={require("../../Asset/Image/banner.png")} alt="Flowers in Chania"/>
                        </div>
                        <div className='page_content content' id='page_tailieu_content'>
                            
                        </div>
                    </div>
                </Content>
            </>
        );
    }
}

export default TaiLieu;