import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { IconMenu } from './IconMenu';
import SettingModal from '@_modal/Setting/SettingModal';
import * as _ from './style';
import '@_styles';

export default function NavBar() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    const handleClick = (item) => {
        if (item.label === '설정') {
        setIsSettingOpen(true);
        } else {
        if (Array.isArray(item.path) && item.path.length > 0) {
            navigate(item.path[0]);
        } else if (typeof item.path === 'string' && item.path.length > 0) {
            navigate(item.path);
        }
        }
    };

    return (
        <>
        <_.MainArea>
            {IconMenu.map((item) => {
            const isLogin = item.label === '로그인';

            const isActive = isLogin
                ? false
                : Array.isArray(item.path)
                ? item.path.some(p => pathname === p || pathname.startsWith(p + '/'))
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
                onClick={() => handleClick(item)}
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

        <SettingModal
            isOpen={isSettingOpen}
            onClose={() => setIsSettingOpen(false)}
        />
        </>
    );
}