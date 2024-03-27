import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Animated,
  DeviceEventEmitter,
  FlatList,
  Keyboard,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  commentMessageFamApi,
  deleteKeepMessageFamApi,
  deleteMessageFamCommentApi,
  deleteMetooMessageFamApi,
  findMessageFamCommentsApi,
  findMessageFamilyApi,
  keepMessageFamApi,
  likeFamilyCommentApi,
  metooMessageFamApi,
  unlikeFamilyCommentApi,
} from '../../../api/MessageApi';
import Comment, {
  MoreCommentsContainer,
  MoreCommentsText,
} from '../../../components/Comment';
import DetailModal from '../../../components/DetailModal';
import InputLayout from '../../../components/InputLayout';
import Message, {
  SpringBtn,
  SpringBtnText,
} from '../../../components/message/Message';
import authStore from '../../../stores/AuthStore';
import familyStore from '../../../stores/FamilyStore';
import {Colors} from '../../../Config';
import {ROUTE_NAME, ServiceLinked} from '../../../Strings';
import {SignedInScreenProps} from '../../../navigators/types';
import Toast from '../../../components/common/Toast';
import NoMessage from '../../../components/message/NoMessage';

export default function MessageFamily({
  navigation,
  route: {params},
}: SignedInScreenProps<'MessageFamily'>) {
  // 가장 아래 (최신 댓글)
  const commentsListRef = useRef<FlatList>(null);
  const [isSent, setSent] = useState(false);

  // for Comments pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchMore = () => {
    setIsLoading(true);
    setQueryEnable(true);
  };

  /** react-hook-form: 댓글 입력 */
  const {register, handleSubmit, watch, setValue} = useForm();

  useEffect(() => {
    register('comment', {required: true});
  }, [register]);

  /** react-query */
  // 1. 메세지 확인
  const {
    data: message,
    isLoading: messageIsLoading,
    refetch: refetchMessage,
  } = useQuery(
    ['MessageFamily', params?.messageId],
    () => findMessageFamilyApi(params?.messageId),
    {
      onError: () => {
        Toast({message: '게시물이 존재하지 않습니다'});
        navigation.goBack();
      },

      onSuccess: ({data}) => {
        if (!data) {
          Toast({message: '게시물이 존재하지 않습니다'});
          navigation.goBack();

          return;
        }

        DeviceEventEmitter.emit('commented', {
          id: data.id,
          commentsCount: data.commentsCount,
        });
      },
    },
  );

  const messageId = message?.data?.id;

  // 2. 댓글 보기
  const {
    data,
    isLoading: commentsIsLoading,
    refetch: refetchComment,
  } = useQuery(
    ['Comments', messageId, prev],
    () => findMessageFamCommentsApi({id: messageId, prev}),
    {
      onSuccess: ({data}) => {
        if (data.length < 20) {
          setIsLast(true);
        } else {
          setPrev(prev + 1);
        }

        // setComments([...comments, ...data]); // inverted flatlist
        setComments([...data?.reverse(), ...comments]);

        setQueryEnable(false);
        setIsLoading(false);
      },
      enabled: !!messageId && queryEnable,
    },
  );

  // 3. 댓글 달기
  const sendComment = useMutation(commentMessageFamApi, {
    onSuccess: async () => {
      setSent(true);

      await refetchMessage();

      setComments([]);
      setPrev(0);
      setQueryEnable(true);
      setIsLast(false);
      setIsLoading(true);

      await refetchComment();
    },
  });

  // 4-1. comment Detail: 댓글 삭제
  const deleteComment = useMutation(deleteMessageFamCommentApi, {
    onSuccess: async () => {
      setRefreshing(true);
      await refetchMessage();

      setComments([]);
      setPrev(0);
      setQueryEnable(true);
      setIsLast(false);
      setIsLoading(true);

      await refetchComment();

      setRefreshing(false);
    },
  });

  // 5-1. keep Message
  const keepMessage = useMutation(keepMessageFamApi);

  // 5-2. quit keep Message
  const deleteKeepMessage = useMutation(deleteKeepMessageFamApi);

  // /** function: toggle keep */
  const toggleKeep = (id, isKept) => {
    isKept ? deleteKeepMessage.mutate(id) : keepMessage.mutate(id);
  };

  /** onValid */
  const onValid = async data => {
    sendComment.mutate({
      id: message?.data?.id,
      payload: {payload: data.comment},
    });

    // 키보드 내리고 input 값 지우기
    setValue('comment', '');
    Keyboard.dismiss();
  };

  const renderMessage = () =>
    message ? (
      <>
        <Message
          id={message.data.id}
          payload={message.data.payload}
          emotion={message.data.emotion}
          commentsCount={message.data.commentsCount}
          isKept={message.data.isKept}
          toggleKeep={toggleKeep}
          onLastPage={headerRightSpring}
        />
        {!isLast && (
          <MoreCommentsContainer
            onPress={() => {
              fetchMore();
            }}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <MoreCommentsText>댓글 더 보기 +</MoreCommentsText>
            )}
          </MoreCommentsContainer>
        )}
      </>
    ) : (
      <NoMessage />
    );

  /** for comment Flatlist */
  const renderComments = ({item: comment}) => {
    return (
      <Comment
        id={comment.id}
        userId={comment.author.id}
        userName={
          familyStore.members[comment.author.id] || comment.author.userName
        }
        timeWritten={comment.createdAt}
        payload={comment.payload}
        // likes={comment.likes}
        setCommentModal={setCommentModal}
        setDetailTarget={setCommentModalTarget}
        // toggleLike={toggleLike}
        profileImage={comment.author.profileImage}
        onLongPress={() => {
          setCommentModal(true);
          setCommentModalTarget({
            id: comment.id,
            authorId: comment.author.id,
          });
        }}
        isDetail={comment.author.id === authStore.userId}
      />
    );
  };

  /** 댓긋 우측 더보기: open Modal */
  const [isConfirmModal, setConfirmModal] = useState(false);
  const [isCommentModal, setCommentModal] = useState(false);
  const [commentModalTarget, setCommentModalTarget] = useState();
  const memoized = useMemo(() => renderComments, []);

  const headerRightAnim = useRef(new Animated.Value(1)).current;
  const headerRightSpring = (iter = 1) => {
    const animSeq = [];
    for (let i = 0; i < iter; i++) {
      animSeq.push(
        ...[
          Animated.spring(headerRightAnim, {
            toValue: 1.12,
            friction: 1,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.spring(headerRightAnim, {
            toValue: 1,
            speed: 50,
            useNativeDriver: true,
          }),
        ],
      );
    }

    Animated.sequence(animSeq).start();
  };

  useEffect(() => {
    if (message?.data?.linkTo !== ServiceLinked.NONE) {
      navigation.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => (
          <Animated.View style={{transform: [{scale: headerRightAnim}]}}>
            <SpringBtn
              onPress={() =>
                navigation.push(
                  message?.data?.linkTo === ServiceLinked.LETTER
                    ? 'LetterSend'
                    : message?.data?.linkTo === ServiceLinked.PHOTO
                    ? 'PhotoSelect'
                    : 'FamilyPediaMember',
                )
              }>
              <SpringBtnText>
                {message?.data?.linkTo === ServiceLinked.LETTER
                  ? '편지 보내기'
                  : message?.data?.linkTo === ServiceLinked.PHOTO
                  ? '사진 올리기'
                  : '인물사전'}
              </SpringBtnText>
            </SpringBtn>
          </Animated.View>
        ),
      });
    }
  }, [headerRightAnim, message]);

  useEffect(() => {
    setTimeout(() => {
      headerRightSpring(2);
    }, 500);
  }, []);

  if (messageIsLoading || (comments.length === 0 && !isLast)) {
    return (
      <InputLayout>
        <ActivityIndicator />
      </InputLayout>
    );
  }

  return (
    <InputLayout
      value={watch('comment')}
      placeholder="댓글을 입력하세요"
      onChangeText={text => setValue('comment', text)}
      onSubmitEditing={handleSubmit(onValid)}
      disabled={!watch('comment')}>
      <FlatList
        data={comments}
        renderItem={memoized}
        showsVerticalScrollIndicator={false}
        ref={commentsListRef}
        initialNumToRender={20}
        getItemLayout={(data, index) => ({
          length: 200,
          offset: 200 * index,
          index,
        })}
        onLayout={() => {
          if (comments.length > 0 && isSent) {
            commentsListRef?.current?.scrollToEnd();
            setSent(false);
          }
        }}
        ListHeaderComponent={renderMessage()}
        bounces={false}
      />

      {/** Modal for Comment Detail */}
      {commentModalTarget?.authorId === authStore.userId && (
        <DetailModal
          targetId={commentModalTarget?.id}
          isDetailModal={isCommentModal}
          isConfirmModal={isConfirmModal}
          setDetailModal={setCommentModal}
          setConfirmModal={setConfirmModal}
          actions={[
            {
              name: '댓글 삭제',
              func: () => deleteComment.mutate(commentModalTarget?.id),
              confirmNeeded: true,
              confirmMessage: '정말 삭제하시겠습니까?',
            },
          ]}
        />
      )}
    </InputLayout>
  );
}
