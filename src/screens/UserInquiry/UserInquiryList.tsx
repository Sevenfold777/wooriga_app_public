import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  useWindowDimensions,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {deleteInquiryApi, findInquiriesApi} from '../../api/UserInquiry';
import NoContent from '../../components/NoContent';
import ScreenLayout, {
  ActivityIndicatorWrapper,
} from '../../components/ScreenLayout';
import Modal from 'react-native-modal';
import {
  ConfirmModalBtn,
  ConfirmModalContainer,
  ConfirmModalText,
  DetailModalAction,
  DetailModalContainer,
  DetailModalText,
} from '../../components/DetailModal';
import {Ionicons} from '@expo/vector-icons';
import {ROUTE_NAME} from '../../Strings';
import {Colors} from '../../Config';
import {SignedInScreenProps} from '../../navigators/types';

const Container = styled.View`
  flex-direction: row;
`;

const SendInquiryBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.main};
  border-radius: 100px;
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 10px;
  width: 90px;
  height: 90px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SendInquiryText = styled.Text`
  text-align: center;
  color: white;
  font-family: 'nanum-bold';
`;

const InquiryContainer = styled.TouchableOpacity`
  padding: 10px;
  border: 1px solid ${Colors.borderLight};
  border-radius: 15px;
  margin: 2px 5px;
`;

const DateText = styled.Text`
  padding: 0px 5px;
  font-family: 'nanum-bold';
`;

const InquiryText = styled.Text`
  flex: 1;
  padding: 5px;
  margin-right: 15px;
  font-family: 'nanum-regular';
`;

const Status = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.main};
  border-radius: 10px;
  width: 60px;
  height: 35px;
`;

const StatusText = styled.Text`
  color: white;
  font-size: 12px;
  font-family: 'nanum-regular';
`;

type InquiryType = {
  id: number;
  isReplied: boolean;
  payload: string;
  reply: string;
  replyDate: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export default function UserInquiryList({
  navigation,
}: SignedInScreenProps<'UserInquiryList'>) {
  const {height: pageHeight} = useWindowDimensions();

  // for pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [inquiries, setInquiries] = useState<InquiryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  /** react-query */
  // 1. get Inquirys sent
  const {refetch: refetchInquiries} = useQuery(
    ['findMyInquiries', {prev}],
    () => findInquiriesApi({prev}),
    {
      onSuccess: ({data}: {data: InquiryType[]}) => {
        if (data.length === 0) {
          setIsLast(true);
        } else {
          setPrev(prev + 1);
          setInquiries([...inquiries, ...data]);
        }

        setQueryEnable(false);
        setIsLoading(false);
      },

      enabled: queryEnable,
    },
  );

  // 2. delete Inquirys
  const deleteInquiry = useMutation(deleteInquiryApi, {
    onSuccess: async () => {
      setRefreshing(true);

      setInquiries([]);
      setPrev(0);
      setQueryEnable(true);
      setIsLast(false);

      await refetchInquiries();

      setRefreshing(false);
    },
  });

  const [isDetailModal, setDetailModal] = useState(false);
  const [isConfirmModal, setConfirmModal] = useState(false);
  const [detailTarget, setDetailTarget] = useState({}); // {id: number,  payload: string}
  const [needConfirm, setNeedConfirm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    setInquiries([]);
    setPrev(0);
    setQueryEnable(true);
    setIsLast(false);

    await refetchInquiries();
    setRefreshing(false);
  };

  const renderInquiries = ({item: inquiry}: {item: InquiryType}) => {
    const dateObj = new Date(inquiry.createdAt);
    const now = new Date();

    const date =
      now.getFullYear() === dateObj.getFullYear()
        ? `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`
        : `${dateObj.getFullYear()}년 ${
            dateObj.getMonth() + 1
          }월 ${dateObj.getDate()}일`;

    return (
      <InquiryContainer
        key={inquiry.id}
        onPress={() => {
          if (inquiry.isReplied) {
            setDetailModal(true);
            setDetailTarget({
              id: inquiry.id,
              title: inquiry.title,
              payload: inquiry.payload,
            });
          } else {
            setDetailModal(true);
            setDetailTarget({
              id: inquiry.id,
              title: inquiry.title,
              payload: inquiry.payload,
            });
          }
        }}>
        <DateText>{date}</DateText>

        <Container>
          <InquiryText numberOfLines={1}>{inquiry.title}</InquiryText>
          <Status>
            <StatusText>{inquiry.isReplied ? '완료' : '대기'}</StatusText>
          </Status>
        </Container>
      </InquiryContainer>
    );
  };

  if (inquiries.length === 0) {
    if (isLast) {
      return (
        <>
          <NoContent payload={'작성한 문의 사항이 없습니다.'} />
          <SendInquiryBtn
            onPress={() => navigation.navigate('UserInquirySend')}>
            <SendInquiryText>{'문의 작성'}</SendInquiryText>
          </SendInquiryBtn>
        </>
      );
    } else {
      return (
        <ScreenLayout>
          <ActivityIndicator />
        </ScreenLayout>
      );
    }
  }

  return (
    <ScreenLayout>
      <FlatList
        data={inquiries}
        renderItem={renderInquiries}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (!isLast && !isLoading) {
            fetchMore();
          }
        }}
        onEndReachedThreshold={0.01}
        scrollEnabled={!isLoading}
        style={{height: '100%'}}
      />
      {isLoading && (
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      )}

      <SendInquiryBtn onPress={() => navigation.navigate('UserInquirySend')}>
        <SendInquiryText>{'문의 작성'}</SendInquiryText>
      </SendInquiryBtn>

      <Modal
        isVisible={isDetailModal}
        onBackdropPress={() => {
          setDetailModal(false);
        }}
        onSwipeComplete={() => {
          setDetailModal(false);
        }}
        swipeDirection="down"
        onModalHide={() => setConfirmModal(needConfirm)}
        style={{margin: 0, justifyContent: 'flex-end'}}
        backdropTransitionOutTiming={0}
        statusBarTranslucent
        deviceHeight={pageHeight + StatusBar.currentHeight}>
        <DetailModalContainer>
          <View style={{alignItems: 'center', marginBottom: 10}}>
            <View style={{position: 'absolute'}}>
              <Ionicons name="remove" size={30} />
            </View>
          </View>

          {/** 1. 메세지 수정 */}
          <DetailModalAction
            onPress={() => {
              setDetailModal(false);
              navigation.navigate('UserInquirySend', {
                title: detailTarget?.title,
                payload: detailTarget?.payload,
                edit: true,
                id: detailTarget.id,
              });
            }}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              borderBottomWidth: 0.2,
              borderBottomColor: Colors.borderLight,
            }}>
            <DetailModalText>{'문의 사항 수정'}</DetailModalText>
          </DetailModalAction>

          {/** 2. 메세지 전송 취소 */}
          <DetailModalAction
            onPress={() => {
              setDetailModal(false);
              setNeedConfirm(true);
            }}>
            <DetailModalText>{'문의 사항 삭제'}</DetailModalText>
          </DetailModalAction>
        </DetailModalContainer>
      </Modal>

      <Modal
        isVisible={isConfirmModal}
        onBackdropPress={() => setConfirmModal(false)}
        onSwipeComplete={() => setConfirmModal(false)}
        onBackButtonPress={() => setConfirmModal(false)}
        swipeDirection="down"
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onModalHide={() => setNeedConfirm(false)}
        backdropTransitionOutTiming={0}
        statusBarTranslucent
        deviceHeight={pageHeight + StatusBar.currentHeight}>
        <ConfirmModalContainer>
          <View style={{padding: 30}}>
            <ConfirmModalText>정말 삭제하시겠습니까?</ConfirmModalText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              borderTopWidth: 0.3,
              borderTopColor: Colors.borderDark,
            }}>
            <ConfirmModalBtn
              onPress={() => {
                setConfirmModal(false);
              }}>
              <ConfirmModalText>취소</ConfirmModalText>
            </ConfirmModalBtn>
            <ConfirmModalBtn
              style={{
                borderLeftWidth: 0.3,
                borderLeftColor: Colors.borderDark,
              }}
              onPress={() => {
                deleteInquiry.mutate({id: detailTarget.id});
                setConfirmModal(false);
              }}>
              <ConfirmModalText>확인</ConfirmModalText>
            </ConfirmModalBtn>
          </View>
        </ConfirmModalContainer>
      </Modal>
    </ScreenLayout>
  );
}
