import styled from "styled-components";

export const AnalystPageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: space-between;
`;

export const ProjectWrapper = styled.div`
  flex: 1 1 calc(33.33% - 40px);
  min-width: 280px;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ProjectTitle = styled.div`
  color: ${({ theme }) => theme.textColor};
  text-align: left;
`;

export const FunnelChartWrapper = styled.div`
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ValueText = styled.div`
  position: absolute;
  bottom: 10px;
  color: ${({ theme }) => theme.textColor};
  font-size: 14px;
  text-align: center;
`;

export const Title = styled.h1`
  font-family: "Montserrat", sans-serif;
  font-size: 2rem;
  margin-bottom: 20px;
`;

export const PageWrapper = styled.div`
  padding: 40px 0;
`;
