import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as _ from './style';
import '@_styles';
import { icons } from './data';
import Box from './Box';
import NavBar from '@_navbar/NavBar';
import Pagination from './Pagination';
import { NoticeItem } from './type';
import getNotice from '../../../api/notice';
export default function Notice() {
    const [notices, setNotices] = useState<NoticeItem[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getNotice()
      .then((data) => {
        setPosts(data?.content ?? []);
        console.log(data);
      })
      .catch((err) => {
        console.log("게시물을 불러오는 데 실패했습니다.", err);
      });
  }, []);

  const filtered = posts.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / 10);
  const startIdx = (page - 1) * 10;
  const paginated = filtered.slice(startIdx, startIdx + 10);

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      }
  };
    return (
        <_.Container>
        <NavBar />
        <_.Wrapper>
            <_.PageTitle>공지사항</_.PageTitle>
            <_.SearchBar>
            <img src={icons.Search} alt="Search" />
            <_.SearchInput
                type="text"
                placeholder="공지사항 검색"
                value={search}
                onChange={e => {
                setSearch(e.target.value);
                setPage(1);
                }}
            />
            </_.SearchBar>
            <_.Add
            src={icons.Add}
            alt="Add"
            onClick={() => navigate('/create-notice')}
            />
        </_.Wrapper>
        {filtered.map(notice => (
            <Box
            key={notice.id}
            idx={notice.id}
            title={notice.title}
            date={notice.createdAt} 
          />
        ))}
        <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
        </_.Container>
    );
}