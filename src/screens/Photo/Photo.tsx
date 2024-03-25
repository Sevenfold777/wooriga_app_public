import {useMutation, useQuery} from '@tanstack/react-query';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Animated,
  DeviceEventEmitter,
  Image,
  Platform,
  // Modal,
  ScrollView,
  StatusBar,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {FlatList, Keyboard} from 'react-native';
import styled from 'styled-components/native';
import {
  commentPhotoApi,
  deletePhotoApi,
  deletePhotoCommentApi,
  editPhotoCommentApi,
  findPhotoApi,
  findPhotoCommentsApi,
  findPhotoLikes,
  likePhotoApi,
  likePhotoCommentApi,
  unlikePhotoApi,
  unlikePhotoCommentApi,
} from '../../api/PhotosApi';
import Comment, {
  MoreCommentsContainer,
  MoreCommentsText,
} from '../../components/Comment';
import ActionIcon from '../../components/message/ActionIcon';
import {Ionicons} from '@expo/vector-icons';
import mutationStore from '../../stores/MutationStore';
import DetailModal from '../../components/DetailModal';
import {Indicator, IndicatorWrapper} from '../../components/CarouselIndicator';
import authStore from '../../stores/AuthStore';
import ScreenLayout from '../../components/ScreenLayout';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import PagerView from 'react-native-pager-view';
import {downloadImage} from '../../helper';
import Toast from '../../components/Toast';
import familyStore from '../../stores/FamilyStore';
import PaginationDot from 'react-native-animated-pagination-dot';
import {ReportTarget} from '../../api/ReportApi';
import FastImage from 'react-native-fast-image';
import {ROUTE_NAME} from '../../Strings';
import {Colors} from '../../Config';
import {SignedInParams, SignedInScreenProps} from '../../navigators/types';

const PhotoContainer = styled.View`
  border-bottom-width: 0.3px;
  border-bottom-color: ${Colors.borderDark};
`;

const PhotoImage = styled.Image`
  justify-content: center;
  align-items: center;
  background-color: ${Colors.borderLight};
`;

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
  padding: 0px 14px;
`;
const Caption = styled.Text`
  /* padding-left: 10px; */
  font-family: 'nanum-regular';
  line-height: 18px;
`;

const Actions = styled.View`
  height: 60px;
  width: 100%;
  background-color: white;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
`;

const Action = styled.TouchableOpacity`
  padding: 10px;
  justify-content: center;
  align-items: center;
`;

const CommentNum = styled.Text`
  font-family: 'nanum-regular';
`;

const CommentsContainer = styled.View`
  padding: 0px 0px;
`;

const ModalBtn = styled.TouchableOpacity`
  flex: 1;
  border: 0.3px solid ${Colors.borderDark};

  padding: 15px;
  margin: 0px 2px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export function Photo({
  navigation,
  route: {params},
}: SignedInScreenProps<'Photo'>) {
  const {width: pageWidth, height: pageHeight} = useWindowDimensions();

  const [currentPage, setCurrentPage] = useState(0);

  /** react-query */
  // 1. 사진 확인: route param으로 받아오기로 함
  const photoId = params?.photoId;
  const [photo, setPhoto] = useState();
  const [images, setImages] = useState();

  const {data, isLoading} = useQuery(
    ['findPhoto', photoId],
    () => findPhotoApi(photoId),
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

        setPhoto(data);

        setLike(data.isLiked);
        setCommentsCnt(data.commentsCount);
        setlikesCnt(data.likesCount);

        const photoFiles = data.files.map(photoImage => {
          return {
            url: photoImage.url,
            // Optional, if you know the image size, you can set the optimization performance
            ...(photoImage.height / photoImage.width > 16 / 9
              ? {
                  width:
                    (((pageWidth * 16) / 9) * photoImage.width) /
                    photoImage.height,
                  height: (pageWidth * 16) / 9,
                }
              : {
                  width: pageWidth,
                  height: (pageWidth * photoImage.height) / photoImage.width,
                }),
            // props to <Image />.
            props: {
              resizeMode: 'contain',
            },
          };
        });

        setImages(photoFiles);
      },
    },
  );

  const [like, setLike] = useState();
  const [commentsCnt, setCommentsCnt] = useState();
  const [likesCnt, setlikesCnt] = useState();

  // 4-1. Photo Detail Modal
  const deletePhoto = useMutation(deletePhotoApi, {
    onSuccess: () => {
      mutationStore.setStatus(true);
      navigation.navigate(ROUTE_NAME.PHOTO_HOME, {isMutated: true});
    },
  });

  // 5-2. like Photo
  const likePhoto = useMutation(likePhotoApi);

  // 5-3. unlike Photo
  const unlikePhoto = useMutation(unlikePhotoApi);

  /** function: toggle metoo */
  const togglePhotoLike = (id, isLiked) => {
    isLiked ? unlikePhoto.mutate(id) : likePhoto.mutate(id);
    DeviceEventEmitter.emit('isLiked', {id, isLiked: like});
  };

  // set headerTitle: photo Theme
  /** set header right Button */
  const HeaderRight = () => (
    <TouchableOpacity
      style={{paddingHorizontal: 15}}
      onPress={() => {
        setDetailModal(true);
      }}>
      <Ionicons name="ellipsis-vertical" size={18} />
    </TouchableOpacity>
  );

  useEffect(() => {
    if (photo?.author.id === authStore.userId)
      navigation.setOptions({
        headerRight: HeaderRight,
      });
  }, [photo]);

  useEffect(() => {
    const commentsSubscription = DeviceEventEmitter.addListener(
      'commented',
      ({id, commentsCount, commentsPreview}) => {
        const newPhoto = photo;
        newPhoto.commentsCount = commentsCount;
        newPhoto.commentsPreview = commentsPreview;

        setPhoto(newPhoto);
        setCommentsCnt(commentsCount);
      },
    );

    return () => commentsSubscription.remove();
  }, [photo]);

  /** 사진 우 상단 더보기: open Modal */
  const [isDetailModal, setDetailModal] = useState(false);
  const [isConfirmModal, setConfirmModal] = useState(false);

  /** 댓긋 우측 더보기: open Modal */
  const [isCommentModal, setCommentModal] = useState(false);
  const [commentModalTarget, setCommentModalTarget] = useState();

  // 4-2. Comment Detail Modal: Delete Comment
  const deleteComment = useMutation(deletePhotoCommentApi, {
    onSuccess: () => {
      // console.log(commentModalTarget.id);
      const indexToChange = photo.commentsPreview.findIndex(
        comment => comment.id === commentModalTarget.id,
      );

      const newPhoto = photo;
      newPhoto.commentsPreview.splice(indexToChange, 1);
      newPhoto.commentsCount = commentsCnt - 1;

      setPhoto(newPhoto);
      setCommentsCnt(commentsCnt - 1);
    },
  });

  const commentActions =
    authStore.userId === commentModalTarget?.authorId
      ? [
          {
            name: '댓글 삭제',
            confirmMessage: '정말 삭제하시겠습니까?',
            func: deleteComment.mutate,
          },
        ]
      : [];

  /** for image zoom */
  const [zoomModal, setZoomModal] = useState(false);
  const [zoomIndex, setZoomIndex] = useState();

  const [iosToast, setIosToast] = useState(false);

  if (isLoading || !photo || !images) {
    return (
      <ScreenLayout>
        <ActivityIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{paddingBottom: 0}}>
        <PhotoContainer>
          <View
            style={{
              width: pageWidth,
              height:
                (pageWidth * photo.files[0].height) / photo.files[0].width,
            }}>
            <PagerView
              initialPage={0}
              style={{flex: 1}}
              onPageSelected={e => {
                setCurrentPage(e.nativeEvent.position);
              }}>
              {photo.files.map((photoImage, index) => (
                <TouchableWithoutFeedback
                  key={photoImage.id}
                  onPress={() => {
                    setZoomModal(true);
                    setZoomIndex(index);
                  }}>
                  <View style={{width: pageWidth}}>
                    <FastImage
                      source={{uri: photoImage.url}}
                      resizeMode="contain"
                      style={{
                        aspectRatio:
                          photo.files[0].width / photo.files[0].height || 3 / 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Colors.borderLight,
                      }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </PagerView>
          </View>

          <Actions>
            <View
              style={{flexDirection: 'row', position: 'absolute', left: 10}}>
              <Action
                onPress={() => {
                  togglePhotoLike(photo.id, like);
                  like ? setlikesCnt(likesCnt - 1) : setlikesCnt(likesCnt + 1);
                  setLike(!like);
                  //   metoo ? setMetoosCnt(metoosCnt - 1) : setMetoosCnt(metoosCnt + 1);
                  //   setMetoo(!metoo);
                }}>
                <ActionIcon
                  iconName="heart"
                  isClicked={like}
                  color={Colors.heart}
                />
                <CommentNum>{likesCnt}</CommentNum>
              </Action>

              <Action
                onPress={() => {
                  navigation.navigate(ROUTE_NAME.PHOTO_COMMENTS, {photo});
                }}>
                <ActionIcon iconName="chatbubble-ellipses" isClicked={false} />
                <CommentNum>{commentsCnt}</CommentNum>
              </Action>
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <IndicatorWrapper>
                <PaginationDot
                  activeDotColor="#262626"
                  curPage={currentPage}
                  maxPage={photo.files.length}
                />
              </IndicatorWrapper>
              <CommentNum></CommentNum>
            </View>
          </Actions>

          <View
            style={{
              borderTopColor: Colors.borderDark,
              borderTopWidth: 0.3,
              padding: 10,
            }}>
            <TitleContainer>
              <Title>{photo.theme}</Title>
            </TitleContainer>
            <CaptionContainer>
              <Caption>{photo.payload}</Caption>
            </CaptionContainer>

            <CaptionContainer
              style={{
                alignItems: 'flex-end',
              }}>
              <Caption>{`from. ${
                familyStore.members[photo.author.id] || photo.author.userName
              }`}</Caption>
            </CaptionContainer>
          </View>
        </PhotoContainer>
        <CommentsContainer>
          {photo.commentsPreview.map(comment => (
            <Comment
              key={comment.id}
              id={comment.id}
              userId={comment.author.id}
              userName={
                familyStore.members[comment.author.id] ||
                comment.author.userName
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
          ))}
          <MoreCommentsContainer
            onPress={() => {
              navigation.navigate(ROUTE_NAME.PHOTO_COMMENTS, {photo});
            }}>
            <MoreCommentsText>댓글 더 보기 +</MoreCommentsText>
          </MoreCommentsContainer>
        </CommentsContainer>
      </ScrollView>

      {/** Modal for Photo Detail */}
      <DetailModal
        targetId={photo.id}
        isDetailModal={isDetailModal}
        isConfirmModal={isConfirmModal}
        setDetailModal={setDetailModal}
        setConfirmModal={setConfirmModal}
        actions={
          authStore.userId === photo.author.id
            ? [
                {
                  name: '사진 삭제',
                  func: () => deletePhoto.mutate(photo.id),
                  confirmNeeded: true,
                  confirmMessage: '정말 삭제하시겠습니까?',
                },
              ]
            : [
                {
                  name: '신고하기',
                  func: () =>
                    navigation.navigate(ROUTE_NAME.REPORT, {
                      targetType: ReportTarget.PHOTO,
                      targetId: photo.id,
                    }),
                  confirmNeeded: false,
                },
              ]
        }
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

      <Modal
        isVisible={zoomModal}
        statusBarTranslucent={true}
        deviceHeight={pageHeight + StatusBar.currentHeight}
        style={{margin: 0, backgroundColor: 'black'}}
        onBackButtonPress={() => {
          setZoomModal(false);
          setZoomIndex();
        }}
        backdropTransitionOutTiming={0}>
        <View
          style={{
            paddingTop: 7,
            // paddingBottom: 20,
            width: '100%',
            height: '100%',
          }}>
          <ImageViewer
            imageUrls={images}
            index={zoomIndex}
            enableSwipeDown={true}
            swipeDownThreshold={50}
            flipThreshold={30}
            onSwipeDown={() => {
              setZoomModal(false);
              setZoomIndex();
            }}
            saveToLocalByLongPress={false}
            footerContainerStyle={{
              width: '100%',
              bottom: Platform.OS === 'ios' ? 15 : 5,
            }}
            renderFooter={currentIndex => (
              <View style={{paddingHorizontal: 20, flexDirection: 'row'}}>
                <ModalBtn
                  onPress={() => {
                    downloadImage(images[currentIndex].url);
                    Toast({message: '사진을 저장하였습니다.'});
                  }}>
                  <Caption
                    style={{
                      color: 'white',
                      fontSize: 16,
                      marginHorizontal: 5,
                    }}>
                    저장
                  </Caption>
                  {/* <Ionicons name="download-outline" color="white" size={20} /> */}
                </ModalBtn>

                <ModalBtn
                  onPress={() => {
                    setZoomModal(false);
                    setZoomIndex();
                  }}>
                  <Caption
                    style={{
                      color: 'white',
                      fontSize: 16,
                      marginHorizontal: 5,
                    }}>
                    닫기
                  </Caption>
                </ModalBtn>
              </View>
            )}
          />
        </View>
      </Modal>
    </ScreenLayout>
  );
}
