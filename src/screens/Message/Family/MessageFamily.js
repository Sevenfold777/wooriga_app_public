import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Animated,
  DeviceEventEmitter,
  FlatList,
  Keyboard,
  Text,
  TouchableOpacity,
} from "react-native";
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
} from "../../../api/MessageApi";
import Comment, {
  MoreCommentsContainer,
  MoreCommentsText,
} from "../../../components/Comment";
import DetailModal from "../../../components/DetailModal";
import InputLayout from "../../../components/InputLayout";
import Message from "../../../components/message/Message";
import authStore from "../../../stores/AuthStore";
import familyStore from "../../../stores/FamilyStore";
import { Colors } from "../../../Config";
import { ROUTE_NAME, ServiceLinked } from "../../../Strings";

export default function MessageFamily({ navigation, route: { params } }) {
  // 가장 아래 (최신 댓글)
  const commentsListRef = useRef();
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
  const { register, handleSubmit, watch, setValue } = useForm();

  useEffect(() => {
    register("comment", { required: true });
  }, [register]);

  /** react-query */
  // 1. 메세지 확인
  const {
    data: message,
    isLoading: messageIsLoading,
    refetch: refetchMessage,
  } = useQuery(
    ["MessageFamily", params?.messageId],
    () => findMessageFamilyApi(params?.messageId),
    {
      onError: () => {
        Toast({ message: "게시물이 존재하지 않습니다" });
        navigation.goBack();
      },

      onSuccess: ({ data }) => {
        if (!data) {
          Toast({ message: "게시물이 존재하지 않습니다" });
          navigation.goBack();

          return;
        }

        DeviceEventEmitter.emit("commented", {
          id: data.id,
          commentsCount: data.commentsCount,
        });
      },
    }
  );

  const messageId = message?.data?.id;

  // 2. 댓글 보기
  const {
    data,
    isLoading: commentsIsLoading,
    refetch: refetchComment,
  } = useQuery(
    ["Comments", messageId, prev],
    () => findMessageFamCommentsApi({ id: messageId, prev }),
    {
      onSuccess: ({ data }) => {
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
    }
  );

  // 3. 댓글 달기
  const sendComment = useMutation(commentMessageFamApi, {
    onSuccess: async () => {
      setSent(true);
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

  // 4-2. Like Comment
  const likeComment = useMutation(likeFamilyCommentApi, {
    onSuccess: async () => {
      await refetchMessage();
    },
  });

  // 4-3. unlike Comment
  const unlikeComment = useMutation(unlikeFamilyCommentApi, {
    onSuccess: async () => {
      await refetchMessage();
    },
  });

  /** function: toggle like */
  const toggleLike = (id, isLiked) =>
    isLiked ? unlikeComment.mutate(id) : likeComment.mutate(id);

  // 5-1. metoo Message
  const metooMessage = useMutation(metooMessageFamApi);

  // 5-2. quit metoo Message
  const deleteMetooMessage = useMutation(deleteMetooMessageFamApi);

  /** function: toggle metoo */
  const toggleMetoo = (id, isMetoo, metoosCount) => {
    isMetoo ? deleteMetooMessage.mutate(id) : metooMessage.mutate(id);
    // console.log({ id, isMetoo, metoosCount });
  };

  // 5-1. keep Message
  const keepMessage = useMutation(keepMessageFamApi);

  // 5-2. quit keep Message
  const deleteKeepMessage = useMutation(deleteKeepMessageFamApi);

  // /** function: toggle keep */
  const toggleKeep = (id, isKept) => {
    isKept ? deleteKeepMessage.mutate(id) : keepMessage.mutate(id);
  };

  /** onValid */
  const onValid = async (data) => {
    sendComment.mutate({
      id: message?.data?.id,
      payload: { payload: data.comment },
    });

    // 키보드 내리고 input 값 지우기
    setValue("comment", "");
    Keyboard.dismiss();
  };

  const renderMessage = () => (
    <>
      <Message
        id={message.data.id}
        payload={message.data.payload}
        emotion={message.data.emotion}
        commentsCount={message.data.commentsCount}
        metoosCount={message.data.metoosCount}
        isMetoo={message.data.isMetooed}
        isKept={message.data.isKept}
        toggleMetoo={toggleMetoo}
        toggleKeep={toggleKeep}
        onLastPage={headerRightSpring}
      />
      {!isLast && (
        <MoreCommentsContainer
          onPress={() => {
            fetchMore();
          }}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <MoreCommentsText>댓글 더 보기 +</MoreCommentsText>
          )}
        </MoreCommentsContainer>
      )}
    </>
  );

  /** for comment Flatlist */
  const renderComments = ({ item: comment }) => {
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

  // refetch commments + refresh flatlist
  const [isRefreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await refetchMessage();
    setRefreshing(false);
  };

  /** 댓긋 우측 더보기: open Modal */
  const [isConfirmModal, setConfirmModal] = useState(false);
  const [isCommentModal, setCommentModal] = useState(false);
  const [commentModalTarget, setCommentModalTarget] = useState();
  const memoized = useMemo(() => renderComments, [comments]);

  /** 메세지 더보기 */
  const [isDetailModal, setDetailModal] = useState(false);

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
        ]
      );
    }

    Animated.sequence(animSeq).start();
  };

  useEffect(() => {
    if (
      [ServiceLinked.LETTER, ServiceLinked.PEDIA, ServiceLinked.PHOTO].includes(
        message?.data?.linkTo
      )
    ) {
      navigation.setOptions({
        headerRight: () => (
          <Animated.View style={{ transform: [{ scale: headerRightAnim }] }}>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.main,
                padding: 10,
                marginHorizontal: 15,
                borderRadius: 10,
              }}
              onPress={() =>
                navigation.navigate(
                  message?.data?.linkTo === ServiceLinked.LETTER
                    ? ROUTE_NAME.LETTER_SEND
                    : message?.data?.linkTo === ServiceLinked.PHOTO
                    ? ROUTE_NAME.PHOTO_SELECT
                    : ROUTE_NAME.FAMILYPEDIA_HOME
                )
              }
            >
              <Text style={{ fontFamily: "nanum-regular", color: "white" }}>
                {message?.data?.linkTo === ServiceLinked.LETTER
                  ? "편지 보내기"
                  : message?.data?.linkTo === ServiceLinked.PHOTO
                  ? "사진 올리기"
                  : "인물사전"}
              </Text>
            </TouchableOpacity>
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
      value={watch("comment")}
      placeholder="댓글을 입력하세요"
      onChangeText={(text) => setValue("comment", text)}
      onSubmitEditing={handleSubmit(onValid)}
      disabled={!watch("comment")}
    >
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
            commentsListRef?.current.scrollToEnd();
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
              name: "댓글 삭제",
              func: () => deleteComment.mutate(commentModalTarget?.id),
              confirmNeeded: true,
              confirmMessage: "정말 삭제하시겠습니까?",
            },
          ]}
        />
      )}
    </InputLayout>
  );
}
