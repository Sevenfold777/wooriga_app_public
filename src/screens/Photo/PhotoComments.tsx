import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Keyboard,
  View,
} from 'react-native';
import {
  commentPhotoApi,
  deletePhotoCommentApi,
  findPhotoCommentsApi,
} from '../../api/PhotosApi';
import Comment, {
  MoreCommentsContainer,
  MoreCommentsText,
} from '../../components/Comment';
import DetailModal from '../../components/DetailModal';
import authStore from '../../stores/AuthStore';
import InputLayout from '../../components/InputLayout';
import styled from 'styled-components/native';
import familyStore from '../../stores/FamilyStore';
import {Colors} from '../../Config';
import {SignedInScreenProps} from '../../navigators/types';

const TitleContainer = styled.View`
  justify-content: center;
  padding: 5px 10px;
`;

const Title = styled.Text`
  font-family: 'nanum-bold';
  font-size: 16px;
  line-height: 20px;
`;

const CaptionContainer = styled.View`
  justify-content: center;
  padding: 0px 20px;
`;
const Caption = styled.Text`
  font-family: 'nanum-regular';
  line-height: 18px;
`;

const PhotoBodyContainer = styled.View`
  border-bottom-color: ${Colors.borderDark};
  border-bottom-width: 0.3px;
  padding: 0px 10px 20px 10px;
  margin-bottom: 10px;
`;

type CommentType = {
  author: {
    id: number;
    userName: string;
  };
  id: number;
  payload: string;
  createdAt: string;
  updatedAt: string;
};

export default function PhotoComments({
  route: {params},
}: SignedInScreenProps<'PhotoComments'>) {
  const photo = params.photo;

  const [commentsCnt, setCommentsCnt] = useState(params.photo.commentsCount);

  // for Comments pagination (lazy loading)
  const [queryEnable, setQueryEnable] = useState(true);
  const [prev, setPrev] = useState(0);
  const [comments, setComments] = useState<CommentType[]>([]);
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

  // 2. 댓글 보기
  const {refetch: refetchComment} = useQuery(
    ['Comments', photo.id, prev],
    () => findPhotoCommentsApi({id: photo.id, prev}),
    {
      onSuccess: ({data}: {data: CommentType[]}) => {
        if (data.length < 20) {
          setIsLast(true);
        } else {
          setPrev(prev + 1);
        }

        const newComments = [...comments, ...data];
        setComments(newComments);

        DeviceEventEmitter.emit('commented', {
          id: params.photo.id,
          commentsCount: commentsCnt,
          commentsPreview: newComments.slice(0, 2).reverse(),
        });

        setQueryEnable(false);
        setIsLoading(false);
      },
      enabled: !!photo && queryEnable,
    },
  );

  // 3. 댓글 달기
  const sendComment = useMutation(commentPhotoApi, {
    onSuccess: async () => {
      setCommentsCnt(commentsCnt + 1);

      setComments([]);
      setPrev(0);
      setQueryEnable(true);
      setIsLast(false);
      setIsLoading(true);

      await refetchComment();
    },
  });

  /** 댓긋 우측 더보기: open Modal */
  const [isCommentModal, setCommentModal] = useState(false);
  const [isConfirmModal, setConfirmModal] = useState(false);
  const [commentModalTarget, setCommentModalTarget] = useState<{
    id: number;
    authorId: number;
  }>();

  // 4-2. Comment Detail Modal: Delete Comment
  const deleteComment = useMutation(deletePhotoCommentApi, {
    onSuccess: async () => {
      setCommentsCnt(commentsCnt - 1);

      setComments([]);
      setPrev(0);
      setQueryEnable(true);
      setIsLast(false);
      setIsLoading(true);

      await refetchComment();
    },
  });

  /** onValid */
  const onValid = async ({comment}: {comment: string}) => {
    sendComment.mutate({id: photo.id, payload: {payload: comment}});
    // 키보드 내리고 input 값 지우기
    setValue('comment', '');
    Keyboard.dismiss();
  };

  /** for comment Flatlist */
  const renderComments = ({item: comment}: {item: CommentType}) => (
    <Comment
      userId={comment.author.id}
      userName={
        familyStore.members[comment.author.id] || comment.author.userName
      }
      timeWritten={comment.createdAt}
      payload={comment.payload}
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

  return (
    <InputLayout
      register={register('comment')}
      value={watch('comment')}
      placeholder="댓글을 입력하세요"
      onChangeText={text => setValue('comment', text)}
      onSubmitEditing={handleSubmit(onValid)}
      disabled={!watch('comment')}>
      <FlatList
        data={comments}
        renderItem={renderComments}
        inverted
        showsVerticalScrollIndicator={false}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListFooterComponent={() => (
          <View>
            <PhotoBodyContainer>
              <TitleContainer>
                <Title>{photo.theme}</Title>
              </TitleContainer>
              <CaptionContainer>
                <Caption>{photo.payload}</Caption>
              </CaptionContainer>
            </PhotoBodyContainer>
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
          </View>
        )}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
      />

      {/** Modal for Comment Detail */}
      {commentModalTarget?.authorId === authStore.userId && (
        <DetailModal
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
