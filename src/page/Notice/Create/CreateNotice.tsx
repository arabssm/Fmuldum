import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as _ from './style';
import NavBar from '@_components/NavBar/NavBar';
import EditSuccess from '@_modal/Notice/EditSuccess';
import '@_styles';
import useNoticeState from './useNoticeState';
import { Notice } from './type';
import { savefile, createnoticeallalert, createnoticeteamalert } from '../../../api/notice';

export default function CreateNotice() {
    const navigate = useNavigate();
    const [notice, setNotice] = useNoticeState(); 
    const [showModal, setShowModal] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ 팀 목록
    const [teams, setTeams] = useState([
        { id: 'apple', name: '사과' },
        { id: 'banana', name: '바나나' },
        { id: 'orange', name: '오렌지' },
    ]);

    useEffect(() => {
        const createPreviews = async () => {
            const previews: string[] = await Promise.all(
                imageFiles.map((file) => {
                    return new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                    });
                })
            );
            setPreviewUrls(previews);
        };

        if (imageFiles.length > 0) {
            createPreviews();
        }
    }, [imageFiles]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNotice(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setNotice(prev => ({ ...prev, content: value }));
    };

    const insertTag = (tag: string) => {
        const openTag = `<${tag}>`;
        const closeTag = `</${tag}>`;

        const textarea = document.getElementById('notice-content') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

        const newValue =
            value.slice(0, start) + openTag +
            value.slice(start, end) + closeTag +
            value.slice(end);

        setNotice(prev => ({ ...prev, content: newValue.split('\n') }));

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + openTag.length + (end - start),
                start + openTag.length + (end - start)
            );
        }, 0);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        setImageFiles(prev => [...prev, ...files]);

        const urls = files.map(f => URL.createObjectURL(f));
        setPreviewUrls(prev => [...prev, ...urls]);
    };

    const handleRemoveImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));

        setPreviewUrls(prev => {
            const urlToRevoke = prev[index];
            if (urlToRevoke?.startsWith('blob:')) URL.revokeObjectURL(urlToRevoke);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const uploadedUrls: string[] = [];

            for (const file of imageFiles) {
                const res = await savefile(file);
                uploadedUrls.push(res.fileUrl);
            }

            const filesPayload = uploadedUrls.map(url => ({ url }));
            const isTeam = notice.team_id !== undefined && notice.team_id !== '';

            if (!isTeam) {
                await createnoticeallalert(
                    notice.title,
                    notice.content,
                    filesPayload,
                    "GENERAL",
                    notice.teacher
                );
            } else {
                await createnoticeteamalert(
                    notice.title,
                    notice.content,
                    filesPayload,
                    notice.teacher,
                    notice.teacherId,
                    "TEAM",
                    notice.team_id
                );
            }

            setShowModal(true);
        } catch (err) {
            alert('공지 등록 실패');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        return () => previewUrls
            .filter(u => u.startsWith('blob:'))
            .forEach(URL.revokeObjectURL);
    }, [previewUrls]);

    return (
        <_.Container>
            <NavBar />
            <_.Wrapper>
                <_.PageTitle>공지사항 등록</_.PageTitle>
                <_.BoxGroup>
                    <_.TextInput
                        type="text"
                        name="title"
                        value={notice.title}
                        onChange={handleChange}
                        placeholder="공지사항의 제목을 등록하세요"
                    />

                      <_.SelectInput
                          name="team_id"
                          value={notice.team_id}
                          onChange={handleChange}
                        >
                          <option value="">선택하세요</option>
                          <option value="ara">아라</option>
                          <option value="andamiro">안다미로</option>
                          <option value="insert">인서트</option>
                          <option value="odessey">오디세이</option>
                          <option value="pluto">플루토</option>
                          <option value="tera">테라</option>
                          <option value="solvit">솔빗</option>
                          <option value="Echo">Echo</option>
                          <option value="Haro">Haro</option>
                          <option value="Baro">Baro</option>
                          <option value="Paletto">Paletto</option>
                          <option value="PARADOX">PARADOX</option>
                        </_.SelectInput>


                    <_.TagBox>
                        <_.TagButton onClick={() => insertTag('제목1')}>h1</_.TagButton>
                        <_.TagButton onClick={() => insertTag('제목2')}>h2</_.TagButton>
                        <_.TagButton onClick={() => insertTag('제목3')}>h3</_.TagButton>
                        <_.TagButton onClick={() => insertTag('제목4')}>h4</_.TagButton>
                        <_.TagButton onClick={() => insertTag('강조')}>B</_.TagButton>
                    </_.TagBox>

                    <_.Textarea
                        id="notice-content"
                        value={notice.content}
                        onChange={handleContentChange}
                        placeholder="공지사항 내용을 입력하세요 (100자 이상)"
                    />

                    <_.ChangeImg
                        type="file"
                        accept="image/*"
                        id="image-upload"
                        onChange={handleImageChange}
                    />

                    <_.Picture onClick={() => document.getElementById('image-upload')?.click()}>
                        이미지를 클릭하여 추가해주세요
                    </_.Picture>

                    {previewUrls.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                            {previewUrls.map((url, idx) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`미리보기 ${idx}`}
                                    style={{ width: 120, borderRadius: 6, cursor: 'pointer' }}
                                    onClick={() => handleRemoveImage(idx)}
                                />
                            ))}
                        </div>
                    )}

                    <_.EnrollButton onClick={handleSubmit}>등록하기</_.EnrollButton>
                </_.BoxGroup>
            </_.Wrapper>

            {showModal && (
                <EditSuccess
                    onClose={() => {
                        setShowModal(false);
                        navigate('/notice');
                    }}
                />
            )}
        </_.Container>
    );
}
