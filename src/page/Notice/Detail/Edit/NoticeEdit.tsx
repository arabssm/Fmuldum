import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as _ from './style';
import NavBar from '@_navbar/NavBar';
import EditSuccess from '@_modal/Notice/EditSuccess';
import { getNoticeDetail,modifynotice,modifynotice1,savefile } from '../../../../api/notice';
import { Notice } from './type';

export default function NoticeEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const insertTag = (tag: string) => {
    if (!notice) return;
    const openTag = `<${tag}>`;
    const closeTag = `</${tag}>`;
    const textarea = document.getElementById('notice-content') as HTMLTextAreaElement;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end, value } = textarea;
    const newValue =
      value.slice(0, start) +
      openTag +
      value.slice(start, end) +
      closeTag +
      value.slice(end);
    setNotice(prev => prev && ({ ...prev, content: newValue }));
    setTimeout(() => {
      textarea.focus();
      const pos = start + openTag.length + (end - start);
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getNoticeDetail(Number(id));
        setNotice(data);
        if (data.Files?.length) {
          setPreviewUrls(data.Files);
        }
      } catch (err) {
        console.error('공지 불러오기 실패', err);
      }
    })();
  }, [id]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNotice(prev => prev && ({ ...prev, [name]: value }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNotice(prev => prev && ({ ...prev, content: value }));
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);

    const newUrls = files.map(f => URL.createObjectURL(f));
    setPreviewUrls(prev => [...prev, ...newUrls]);
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
        await modifynotice1(
          id,
          notice.title,
          notice.content,
          filesPayload,
          "GENERAL",
          notice.teacher
        );
      } else {
        await modifynotice(
          id,
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
    }finally {
        setIsSubmitting(false); 
      }
  };
  

  if (!notice) return null;

  return (
    <_.Container>
      <NavBar />
      <_.Wrapper>
        <_.PageTitle>공지사항 수정</_.PageTitle>
        <_.BoxGroup>
          <_.TextInput
            type="text"
            name="title"
            value={notice.title}
            onChange={handleChange}
            placeholder="공지사항의 제목을 등록하세요"
          />
          <_.TextInput
            type="text"
            name="team_id"
            value={notice.team_id}
            onChange={handleChange}
            placeholder="누구에게 공지할 지 등록하세요"
          />

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
            multiple
            onChange={handleFilesChange}
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
                style={{ width: '120px', borderRadius: '6px' }}
            />
            ))}
        </div>
          )}

          <_.EnrollButton onClick={handleSubmit}>
            수정하기
          </_.EnrollButton>
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
