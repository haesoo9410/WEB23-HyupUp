import styled from 'styled-components';

const Styled = {
  KanbanTaskWrapper: styled.article`
    width: 700px;
    height: 70px;
    border-radius: 10px;
    font: ${({ theme }) => theme.font.bold_regular};
    background-color: ${({ theme }) => theme.color.gray100};
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 10px 40px;

    h4 {
      padding-left: 30px;
    }

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    span {
      font: ${({ theme }) => theme.font.bold_extra_small};
      font-size: 14px;
    }

    input {
      background-color: ${({ theme }) => theme.color.gray100};
      font: ${({ theme }) => theme.font.bold_regular};
      ::placeholder {
        color: ${({ theme }) => theme.color.gray500};
      }
      width: 500px;
      height: 30px;
    }
  `,
  MemberContainer: styled.div`
    width: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      width: 80%;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    img {
      width: 15px;
    }

    div > img {
      opacity: 0;
    }

    ul {
      position: absolute;
      top: 50px;
      right: 10px;
    }

    .userImage {
      width: 50px;
    }
  `,
  DropdownWrapper: styled.div`
    position: relative;
    img {
      width: 25px;
      margin-right: 35px;
    }
  `,
};

export default Styled;
