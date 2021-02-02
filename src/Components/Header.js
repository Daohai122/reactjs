import React, {useState} from 'react'
import { Link } from "react-router-dom";
import { Layout } from 'antd';
const { Header } = Layout;

export default function HeaderPage(props) {
    console.log(props)
    const [showmenu, setShowMenu] = useState(false);
   
    return (
        <div>
            <Header className="site-layout-background header_menu" >
                    <div className="menu_content">
                        <div className={showmenu? 'menu_item responsive icon': 'menu_item icon'} onClick={() => setShowMenu(!showmenu)}>
                            <i className="fa fa-2x fa-bars" style={{marginRight: 10, verticalAlign: 'middle'}}></i> 
                        </div>
                        <div className={showmenu? 'menu_item responsive nopading': 'menu_item nopading'}>
                        </div>
                        <div className={showmenu? 'menu_item responsive': 'menu_item'}>
                            <Link onClick={(e) => {
                                setShowMenu(false)
                                props.directOther&&props.directOther(e, 'thele')
                                }}  className={props.trang === 'thele' ? 'text_menu active' : 'text_menu'} to='/thele'>Thể lệ</Link>
                        </div>
                        <div className={showmenu? 'menu_item responsive': 'menu_item'}>
                            <Link className={props.trang === 'duthi' ? 'text_menu active' : 'text_menu'} to='/duthi' >Dự thi</Link>
                        </div>
                        <div  className={showmenu? 'menu_item responsive': 'menu_item'} >
                            <Link onClick={(e) => {setShowMenu(false); props.directOther&&props.directOther(e, 'ketqua')}} className={props.trang === 'ketqua' ? 'text_menu active' : 'text_menu'} to='/ketqua'>Kết quả</Link>
                        </div>
                        <div  className={showmenu? 'menu_item responsive': 'menu_item'} >
                            <Link onClick={(e) => {setShowMenu(false); props.directOther&&props.directOther(e, 'tailieu')}} className={props.trang === 'tailieu' ? 'text_menu active' : 'text_menu'} to='/tailieu'>Tài liệu tham khảo</Link>
                        </div>
                        
                    </div>
            </Header>
            <div className='header_mobile'>
                <div className='wrap_menu'>
                    <div className="item">
                        <Link className={props.trang === 'duthi' ? 'text_menu active' : 'text_menu'} to='/duthi' >Dự thi</Link>
                    </div>
                    <div className="item">
                        <Link onClick={(e) => {setShowMenu(false); props.directOther&&props.directOther(e, 'tailieu')}} className={props.trang === 'tailieu' ? 'text_menu active' : 'text_menu'} to='/tailieu'>Tài liệu</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
