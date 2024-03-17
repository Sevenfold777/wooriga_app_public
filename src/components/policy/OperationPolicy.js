import {
  Body,
  BodyNumber,
  BodyText,
  Container,
  InnerBody,
  Segment,
  SubTitleText,
  Table,
} from "./PolicyShared";

export default function OperationPolicyPayload({}) {
  return (
    <Container>
      <SubTitleText>제 1조 목적</SubTitleText>
      <Segment>
        <Body>
          <BodyNumber>1-1)</BodyNumber>
          <BodyText>
            우리가(이하 ‘회사’라 합니다.)는 우리가 어플리케이션 서비스(이하
            ‘서비스’라 합니다.)를 이용하는 가족 구성원 모두(이하 ‘이용자’라
            합니다.)가 편안하고 원활하게 이용할 수 있도록 지속적으로 서비스를
            발전해 나갈 예정입니다.
          </BodyText>
        </Body>
        <Body>
          <BodyNumber>1-2)</BodyNumber>
          <BodyText>
            본 운영정책은 원활한 서비스 이용을 위해 작성되었으며, ‘이용자’가
            ‘서비스’를 이용할 때 준수해야할 사항에 대해 작성되어 있습니다.
          </BodyText>
        </Body>

        <Body>
          <BodyNumber>1-3)</BodyNumber>
          <BodyText>
            ‘이용자’가 본 운영정책의 약관 내용을 위반한 것으로 확인된 경우,
            ‘회사’는 ‘이용자’에게 ‘서비스’ 이용제한 또는 ‘서비스’ 이용계약 해지
            등의 조치를 취할 수 있습니다. 이 경우 ‘이용자’는 불이익을 당할 수
            있습니다.
          </BodyText>
        </Body>

        <Body>
          <BodyNumber>1-4)</BodyNumber>
          <BodyText>
            ‘회사’는 서비스와 관련되어 본 운영정책이 변경될 경우, 최소 7일 전에
            공지하여 변경됨을 안내할 예정입니다.
          </BodyText>
        </Body>

        <Body>
          <BodyNumber>1-5)</BodyNumber>
          <BodyText>
            본 운영정책에서 별도로 정의하지 않은 용어에 대한 해석은 관계 법령 및
            지침, 우리가 이용약관, 개인정보취급방침, 상관례 등에 의합니다.
          </BodyText>
        </Body>
      </Segment>

      <SubTitleText>제 2조 메세지 기능 이용 시 주의사항</SubTitleText>
      <Segment>
        <Body>
          <BodyNumber>2-1)</BodyNumber>
          <BodyText>
            메세지 기능은 ‘가족’ 만 볼 수 있는 것이 아닌, ‘전체 이용자’ 모두가
            볼 수 있습니다.
          </BodyText>
        </Body>

        <Body>
          <BodyNumber>2-2)</BodyNumber>
          <BodyText>
            이용계약이 해지되더라도, 이전에 등록한 메세지는 ‘서비스’의 일부로
            포함되어 삭제되지 않습니다.
          </BodyText>
        </Body>

        <Body>
          <BodyNumber>2-3)</BodyNumber>
          <BodyText>
            메세지 기능을 이용하는 과정에서 ‘이용자’가 운영정책을 위반할 경우
            ‘회사’는 ‘전체 이용자’ 모두에게 피해가 가지 않도록 ‘이용자’가 작성한
            메세지에 대해 조치합니다.
          </BodyText>
        </Body>

        <Body>
          <BodyNumber>2-4)</BodyNumber>
          <BodyText>
            메세지 기능을 이용하는 과정에서 제 4조 7항을 위반할 경우 해당 법률에
            따라 처벌될 수 있으며, 모든 책임은 ‘이용자’ 본인에게 있습니다.
          </BodyText>
        </Body>

        <Body>
          <BodyNumber>2-5)</BodyNumber>
          <BodyText>
            메세지 기능을 이용하는 과정에서 제 4조 항목 위반으로 관련된 다른
            ‘이용자’가 문제를 제기할 경우 유포한 ‘이용자’는 모든 법적 책임을
            부담합니다.
          </BodyText>
        </Body>

        <Body>
          <BodyNumber>2-6)</BodyNumber>
          <BodyText>
            위반 항목에 해당되는 메세지의 불건전한 정도에 따라 제 4조에
            구체적으로 해당되지 않은 사항이라도 기타 사회 통념상 수용하기 어려운
            게시물을 등록하거나, ‘서비스’ 운영에 어려움 또는 지장을 초래할 경우
            이용이 제한될 수 있습니다.
          </BodyText>
        </Body>

        <Body>
          <BodyNumber>2-7)</BodyNumber>
          <BodyText>
            ‘서비스’ 이용제한 및 ‘서비스’ 이용계약 해지의 상세 내용은 아래와
            같습니다.
          </BodyText>
        </Body>

        <Table
          rows={[
            {
              tag: "서비스 이용제한",
              payload:
                "‘서비스’를 이용하는 ‘이용자’의 계정을 일정기간 동안 ‘서비스’ 이용 불가 상태로 변경합니다.",
            },
            {
              tag: "서비스 이용계약 해지",
              payload:
                "‘서비스’를 이용하는 ‘이용자’의 계정을 ‘이용계약 해지’하여 이용 불가 및 탈퇴 상태로 변경합니다.",
            },
          ]}
        />
      </Segment>

      <SubTitleText>제 3조 사진에 기능 이용 시 주의사항</SubTitleText>
      <Segment>
        <Body>
          <BodyNumber>3-1)</BodyNumber>
          <BodyText>사진 기능은 ‘가족’ 만 볼 수 있습니다.</BodyText>
        </Body>

        <Body>
          <BodyNumber>3-2)</BodyNumber>
          <BodyText>
            이용계약이 해지되더라도, 이전에 등록한 사진은 일정 기간동안 삭제되지
            않습니다. 다만, 즉시 삭제를 원할 경우, 1:1 고객센터 혹은 이외의
            방법으로 ‘회사’에 연락하여 사진 삭제 요청을 할 수 있습니다.
          </BodyText>
        </Body>

        <Body>
          <BodyNumber>3-3)</BodyNumber>
          <BodyText>
            사진 기능이 ‘가족’ 만 볼 수 있더라도, 민감한 정보가 포함되거나 자신
            또는 타인의 개인정보가 포함된 이미지는 등록하지 않도록 유의해 주셔야
            합니다.
          </BodyText>
        </Body>

        <Body>
          <BodyNumber>3-4)</BodyNumber>
          <BodyText>‘이용자‘가 등록한 사진은 회사가 볼 수 없습니다.</BodyText>
        </Body>
      </Segment>

      <SubTitleText>제 4조 서비스 이용정지 수준 안내</SubTitleText>
      <Segment>
        <Body>
          <BodyNumber>4-1)</BodyNumber>
          <BodyText>
            원활한 ‘서비스’ 운영을 위해 아래 각 호에 해당하는 행위가 적발될 경우
            1차, 등록한 게시물 숨김 또는 경고, 2차, 등록한 게시물 삭제 또는
            이용계약해지가 진행될 수 있습니다.
          </BodyText>
        </Body>
        <InnerBody>
          <BodyNumber>4-1-1)</BodyNumber>
          <BodyText>
            다른 ‘이용자’의 명예를 훼손시키거나 허위사실을 유포하는 행위
          </BodyText>
        </InnerBody>
        <InnerBody>
          <BodyNumber>4-1-2)</BodyNumber>
          <BodyText>
            다른 ‘이용자’의 개인정보를 수집, 저장, 공개하는 행위
          </BodyText>
        </InnerBody>
        <InnerBody>
          <BodyNumber>4-1-3)</BodyNumber>
          <BodyText>
            미풍양속에 위반되는 내용의 정보, 문장, 이모티콘, 이미지 등을 다른
            '이용자'에게 유포하는 행위
          </BodyText>
        </InnerBody>
        <InnerBody>
          <BodyNumber>4-1-4)</BodyNumber>
          <BodyText>다른 ‘이용자'를 위협하거나 괴롭히는 행위</BodyText>
        </InnerBody>
        <InnerBody>
          <BodyNumber>4-1-5)</BodyNumber>
          <BodyText>
            다른 '이용자’에게 혐오 발언, 차별 행위, 외설적이거나 수치심이나
            혐오감 또는 공포심을 불러 일으키는 언어를 게시하거나 권장하는 행위
          </BodyText>
        </InnerBody>
        <InnerBody>
          <BodyNumber>4-1-6)</BodyNumber>
          <BodyText>
            컴퓨터 소프트웨어, 하드웨어, 전기통신 장비의 정상적인 가동 방해,
            파괴의 목적으로 고안된 소프트웨어 바이러스, 기타 컴퓨터 코드를
            이용하여 '서비스' 운영에 방해를 주는 행위
          </BodyText>
        </InnerBody>
        <InnerBody>
          <BodyNumber>4-1-7)</BodyNumber>
          <BodyText>
            다른 ‘이용자’에게 개인 또는 기업의 영리를 목적으로 광고 혹은 홍보를
            하여 ‘서비스‘ 운영에 방해를 주는 행위
          </BodyText>
        </InnerBody>
        <InnerBody>
          <BodyNumber>4-1-8)</BodyNumber>
          <BodyText>기타 관련 법령에 위반되는 불법 행위</BodyText>
        </InnerBody>
      </Segment>
    </Container>
  );
}
