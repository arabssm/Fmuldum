import { useState } from 'react';
import * as _ from './style';
import NavBar from '@_components/NavBar/NavBar';
import data, { Props } from './data';
import DetailItem from '@_modal/Item/DetailItem';

export default function ApprovalList({ selectAll }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedName, setSelectedName] = useState('');

  const handleItemClick = (name: string) => {
    setSelectedName(name);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedName('');
  };

  return (
    <_.Container>
      <NavBar />
      <_.ListWrapper>
        {data.map((name, index) => (
          <_.ItemRow key={index}>
            <_.ItemIndex selected={selectAll}>
              {String(index + 1).padStart(2, '0')}
            </_.ItemIndex>
            <_.ItemName onClick={() => handleItemClick(name)}>
              {name}
            </_.ItemName>
            <_.ItemInput placeholder="사유를 적기" />
          </_.ItemRow>
        ))}
      </_.ListWrapper>

      {modalOpen && (
        <DetailItem name={selectedName} onClose={closeModal} />
      )}
    </_.Container>
  );
}
