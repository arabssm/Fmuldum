import { useNavigate, useLocation } from 'react-router-dom';
import { IconMenu } from './IconMenu';
import * as _ from './style';
import '@_styles';

export default function NavBar() {
const navigate = useNavigate();
const { pathname } = useLocation();


return (
    <_.MainArea>
        {IconMenu.map((item) => {
           const isLogin = item.label === '로그인';

           const isActive = isLogin
             ? false
             : Array.isArray(item.path)
             ? item.path.some(p =>
                pathname === p || pathname.startsWith(p + '/')
               )
             : pathname === item.path;
         

            const TagComponent =
                item.label === '로그인'
                    ? _.LoginTag
                    : item.label === '설정'
                    ? _.SettingTag
                    : _.TagArea;

            return (
                <TagComponent
                    key={item.label}
                    onClick={() => navigate(item.path[0])}
                    isActive={isActive}
                >
                    <_.Icon
                        src={isActive ? item.iconActive : item.icon}
                        alt={item.label}
                    />
                    <_.Text isActive={isActive}>{item.label}</_.Text>
                </TagComponent>
            );
        })}
    </_.MainArea>
);
}
