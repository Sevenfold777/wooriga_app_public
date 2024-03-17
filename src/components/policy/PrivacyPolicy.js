import { ScrollView, View } from "react-native";
import styled from "styled-components/native";
import {
  Body,
  BodyNumber,
  BodyText,
  Container,
  InnerBody,
  Segment,
  SubTitleText,
  TableLayout,
  TablePayload,
  TableRow,
  TableTag,
  TableText,
} from "./PolicyShared";

const PrivacyTableTag = styled(TableTag)`
  width: 130px;
  justify-content: center;
`;

const PrivacyTablePayload = styled(TablePayload)`
  width: 210px;
  justify-content: center;
`;

const TableSubTag = styled(TableTag)`
  width: 60px;
  justify-content: center;
`;

const TableSubPayload = styled(TablePayload)`
  width: 140px;
  justify-content: center;
  border-right-width: 0px;
`;

export default function PrivacyPolicyPayload() {
  const PrivacyTableRow = ({ tag, item, purpose, period }) => (
    <TableRow>
      <PrivacyTableTag>
        <TableText style={{ textAlign: "center" }}>{tag}</TableText>
      </PrivacyTableTag>
      <PrivacyTablePayload>
        <TableText>{item}</TableText>
      </PrivacyTablePayload>
      <PrivacyTablePayload>
        <TableText>{purpose}</TableText>
      </PrivacyTablePayload>
      <PrivacyTableTag>
        <TableText>{period}</TableText>
      </PrivacyTableTag>
    </TableRow>
  );

  return (
    <Container>
      <SubTitleText>제 1조 목적</SubTitleText>
      <Segment>
        <Body>
          <BodyNumber>1-1)</BodyNumber>
          <BodyText>
            우리가(이하 “회사”라 합니다)는 회사가 제공하는 우리가 어플리케이션
            서비스 (이하 “서비스”라 합니다)를 이용하는 모든 이용자들의
            개인정보를 중요하게 생각하고 있으며, “개인정보 보호법” 과 함께
            개인정보 관련법령 및 규정을 준수하고 있습니다.
          </BodyText>
        </Body>
        <Body>
          <BodyNumber>1-2)</BodyNumber>
          <BodyText>
            우리가 서비스 개인정보 처리방침은 정부의 법률 및 지침의 변경 및
            당사의 약관 및 내부 정책에 따라 변경될 수 있으며 이를 개정하는 경우
            회사는 변경사항을 즉시 서비스 메인화면에 게시할 예정입니다.
          </BodyText>
        </Body>

        <Body>
          <BodyNumber>1-3)</BodyNumber>
          <BodyText>
            우리가 서비스 개인정보 처리방침은 개인정보의 수집 · 이용 목적을
            안내하기 위해 작성되었습니다.
          </BodyText>
        </Body>
      </Segment>

      <SubTitleText>제 2조 개인정보 수집 · 이용 목적 및 항목</SubTitleText>
      <Segment>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
        >
          <TableLayout>
            <TableRow>
              <PrivacyTableTag>
                <TableText style={{ textAlign: "center" }}>구분</TableText>
              </PrivacyTableTag>
              <PrivacyTablePayload>
                <TableText style={{ textAlign: "center" }}>수집 항목</TableText>
              </PrivacyTablePayload>
              <PrivacyTablePayload>
                <TableText style={{ textAlign: "center" }}>
                  수집 및 이용목적
                </TableText>
              </PrivacyTablePayload>
              <PrivacyTableTag>
                <TableText style={{ textAlign: "center" }}>
                  보유 및 이용기간
                </TableText>
              </PrivacyTableTag>
            </TableRow>

            <TableRow>
              <PrivacyTableTag>
                <TableText style={{ textAlign: "center" }}>회원가입</TableText>
              </PrivacyTableTag>
              <PrivacyTablePayload>
                <TableText>이름, 이메일 주소, 생년월일, 가족관계</TableText>
              </PrivacyTablePayload>
              <PrivacyTablePayload>
                <TableText>
                  서비스 이용, 맞춤형 서비스 제공 및 서비스 개선을 위한 분석 등
                </TableText>
              </PrivacyTablePayload>
              <PrivacyTableTag>
                <TableText>회원탈퇴 시까지</TableText>
              </PrivacyTableTag>
            </TableRow>

            <TableRow>
              <PrivacyTableTag>
                <TableText style={{ textAlign: "center" }}>간편가입</TableText>
              </PrivacyTableTag>
              <PrivacyTablePayload>
                <TableRow>
                  <TableSubTag>
                    <TableText style={{ textAlign: "center" }}>
                      {"공통\n필수"}
                    </TableText>
                  </TableSubTag>
                  <TableSubPayload>
                    <TableText>SNS 가입 이메일 주소</TableText>
                  </TableSubPayload>
                </TableRow>

                <TableRow>
                  <TableSubTag>
                    <TableText style={{ textAlign: "center" }}>
                      카카오
                    </TableText>
                  </TableSubTag>
                  <TableSubPayload>
                    <TableText>
                      {"(필수) 이메일, 주소, 이름\n(선택) 생년월일"}
                    </TableText>
                  </TableSubPayload>
                </TableRow>

                <TableRow>
                  <TableSubTag>
                    <TableText style={{ textAlign: "center" }}>
                      네이버
                    </TableText>
                  </TableSubTag>
                  <TableSubPayload>
                    <TableText>(필수) 이메일 주소, 이름, 생년월일</TableText>
                  </TableSubPayload>
                </TableRow>

                <TableRow>
                  <TableSubTag>
                    <TableText style={{ textAlign: "center" }}>애플</TableText>
                  </TableSubTag>
                  <TableSubPayload>
                    <TableText>(필수) 이메일 주소, 이름</TableText>
                  </TableSubPayload>
                </TableRow>
                {/* <TableText>이름, 이메일 주소, 생념월일, 가족관계</TableText> */}
              </PrivacyTablePayload>
              <PrivacyTablePayload>
                <TableText>
                  서비스 이용, 맞춤형 서비스 제공 및 서비스 개선을 위한 분석 등
                </TableText>
              </PrivacyTablePayload>
              <PrivacyTableTag>
                <TableText>회원탈퇴 시까지</TableText>
              </PrivacyTableTag>
            </TableRow>

            <PrivacyTableRow
              tag="광고 전송 및 마케팅 활용"
              item="닉네임, 이메일 주소, 성별 및 생년월일, 이름, 가족관계, 서비스 이용 기록 및 쿠키, 서비스 이용 시 생성되어 수집되는 정보"
              purpose="프로모션 또는 이벤트 정보 등의 전달, 맞춤형 광고 전송 등 광고 또는 마케팅 목적의 활용"
              period="회원탈퇴 또는 목적 달성 또는 맞춤정보 설정, 광고 전송 및 마케팅 활용 동의 철회 시까지"
            />

            <PrivacyTableRow
              tag="서비스 이용 시 생성되어 수집되는 정보"
              item="서비스 이용 기록, 접속 로그, IP, 쿠키, 온라인식별자(광고ID, UUID 등 이용자 고유 식별자), 단말기 정보(제조사, OS종류, 버전)"
              purpose="이상행위 탐지 및 서비스 개선을 위한 분석"
              period="회원탈퇴 또는 목적 달성 시까지"
            />
            <PrivacyTableRow
              tag="서비스 이용 시 생성되는 메세지"
              item="작성되는 모든 메세지"
              purpose="프로모션 또는 이벤트 활용, 광고, 홍보 목적의 활용"
              period="회원탈퇴 또는 목적 달성 시까지"
            />
          </TableLayout>
        </ScrollView>
      </Segment>

      <SubTitleText>제 3조 개인정보의 수집 방법</SubTitleText>
      <Segment>
        <Body>
          <BodyNumber>3-1)</BodyNumber>
          <BodyText>
            회원가입 및 서비스 이용 과정에서 ‘이용자’가 개인정보 수집에 동의하여
            개인정보를 직 · 간접적으로 입력 또는 선택하는 경우 개인정보를
            수집합니다.
          </BodyText>
        </Body>
        <Body>
          <BodyNumber>3-2)</BodyNumber>
          <BodyText>
            프로모션 또는 이벤트 정보 등의 전달, 맞춤형 광고 전송, 광고 또는
            마케팅 목적의 활용 동의는 마케팅 활용 동의에 체크한 경우 ‘우리가
            개인정보 처리방침’의 제 2조 ‘광고 전송 및 마케팅 활용’의 수집 항목에
            포함된 개인정보를 수집합니다.
          </BodyText>
        </Body>

        <Body>
          <BodyNumber>3-3)</BodyNumber>
          <BodyText>
            회사는 타 기관과 서비스 개선의 목적으로 협력 또는 공조하게 될 경우,
            개인정보를 제공하거나 제공받을 수 있습니다.
          </BodyText>
        </Body>
        <Body>
          <BodyNumber>3-4)</BodyNumber>
          <BodyText>
            회사는 관계 법령에 의거한 정부 기관의 협력 또는 공조 요청이 있을
            경우, 개인정보를 제공하거나 제공받을 수 있습니다.
          </BodyText>
        </Body>
        <Body>
          <BodyNumber>3-5)</BodyNumber>
          <BodyText>
            본 조 3항의 ‘서비스 개선’에 포함되는 항목은 아래와 같습니다.
          </BodyText>
        </Body>
        <InnerBody>
          <BodyNumber>3-5-1)</BodyNumber>
          <BodyText>서비스의 효율성에 대한 개선/모니터링</BodyText>
        </InnerBody>
        <InnerBody>
          <BodyNumber>3-5-2)</BodyNumber>
          <BodyText>기술적인 문제의 진단 또는 해결</BodyText>
        </InnerBody>
        <InnerBody>
          <BodyNumber>3-5-3)</BodyNumber>
          <BodyText>
            개인을 식별할 수 없는 통계적 데이터 또는 투표 결과
          </BodyText>
        </InnerBody>
        <InnerBody>
          <BodyNumber>3-5-4)</BodyNumber>
          <BodyText>서비스 내에서 작성된 모든 메세지</BodyText>
        </InnerBody>
      </Segment>

      <SubTitleText>제 4조 개인정보에 대한 권리</SubTitleText>
      <Segment>
        <Body>
          <BodyNumber>4-1)</BodyNumber>
          <BodyText>
            이용자는 회사에서 사용되는 개인정보에 대해 아래 각 호에 해당하는
            권리를 가지고 있습니다.
          </BodyText>
        </Body>
        <InnerBody>
          <BodyNumber>4-1-1)</BodyNumber>
          <BodyText>이용자 본인의 개인정보 정정권리</BodyText>
        </InnerBody>
        <InnerBody>
          <BodyNumber>4-1-2)</BodyNumber>
          <BodyText>이용자 본인의 개인정보 삭제권리</BodyText>
        </InnerBody>
        <InnerBody>
          <BodyNumber>4-1-3)</BodyNumber>
          <BodyText>이용자 본인의 개인정보 이용동의 정정권리</BodyText>
        </InnerBody>
        <InnerBody>
          <BodyNumber>4-1-4)</BodyNumber>
          <BodyText>이용자 본인의 개인정보 이용동의 삭제권리</BodyText>
        </InnerBody>
      </Segment>

      <SubTitleText>제 5조 개인정보 보호를 위한 이용자의 의무</SubTitleText>
      <Segment>
        <Body>
          <BodyNumber>5-1)</BodyNumber>
          <BodyText>
            이용자는 본인의 개인정보를 안전하게 지키기 위해 이용하시는 우리가
            계정 또는 간편 로그인 계정의 아이디 및 비밀번호를 주기적으로 관리 ·
            변경하는 등의 노력을 기울일 의무가 있습니다.
          </BodyText>
        </Body>
        <Body>
          <BodyNumber>5-2)</BodyNumber>
          <BodyText>
            이용자는 자신의 개인정보를 가장 최신의 상태로 정확하게 입력할 의무가
            있습니다.
          </BodyText>
        </Body>
        <Body>
          <BodyNumber>5-3)</BodyNumber>
          <BodyText>
            이용자가 다른 사람의 개인정보를 무단으로 이용(회원가입, 서비스 이용
            등)할 경우, 이용계약 해지와 함께 관련 법률에 의거하여 처벌될 수
            있습니다.
          </BodyText>
        </Body>
        <Body>
          <BodyNumber>5-4)</BodyNumber>
          <BodyText>
            이용자는 다른 사람의 개인정보를 유출하거나 침해하지 않을 의무를
            가지고 있습니다. 이를 행할 경우, 개인정보 관련 법령에 의거하여
            처벌될 수 있습니다.
          </BodyText>
        </Body>
      </Segment>

      <SubTitleText>부칙1.</SubTitleText>
      <Segment>
        <Body>
          <BodyText>
            우리가 개인정보 이용정책은 2023년 2월 16일부터 시행됩니다.
          </BodyText>
        </Body>
      </Segment>
    </Container>
  );
}
