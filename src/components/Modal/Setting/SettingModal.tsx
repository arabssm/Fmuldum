import * as _ from './style';

interface SettingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function SettingModal({ isOpen, onClose, onConfirm }: SettingModalProps) {
    if (!isOpen) return null;

    return (
        <_.Overlay>
        <_.ModalContent>
            <_.Title>로그아웃</_.Title>
            <_.Message>정말 로그아웃 하시겠습니까?</_.Message>
            <_.ButtonGroup>
            <_.Button onClick={onConfirm}>로그아웃</_.Button>
            <_.Button className="cancel" onClick={onClose}>취소</_.Button>
            </_.ButtonGroup>
        </_.ModalContent>
        </_.Overlay>
    );
}
