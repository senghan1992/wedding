import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "../button"
import { dayjs } from "../../const"
import { Modal } from "../modal"
import { SERVER_URL } from "../../env"

/**
 * 방명록 입력 규칙 설정
 */
const RULES = {
  name: {
    maxLength: 10,
  },
  content: {
    maxLength: 100,
  },
  password: {
    minLength: 4,
    maxLength: 20,
  },
}

const PAGES_PER_BLOCK = 5
const POSTS_PER_PAGE = 5
const STORAGE_KEY = "wedding_guestbook_posts"

/**
 * 방명록 게시물 타입 정의
 */
type Post = {
  id: number
  timestamp: number
  name: string
  content: string
}

type LocalStoredPost = Post & { password?: string }

/**
 * 로컬스토리지 방명록 헬퍼 함수
 * (백엔드 서버가 없을 때 브라우저에서 안전하게 동작)
 */
const getLocalPosts = (): LocalStoredPost[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

const saveLocalPost = (name: string, content: string, password: string): Post => {
  const posts = getLocalPosts()
  const newPost: LocalStoredPost = {
    id: Date.now(),
    name,
    content,
    password,
    timestamp: Math.floor(Date.now() / 1000),
  }
  const nextPosts = [newPost, ...posts]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPosts))
  return newPost
}

const deleteLocalPost = (
  id: number,
  password: string,
): { success: boolean; wrongPassword?: boolean } => {
  const posts = getLocalPosts()
  const target = posts.find((p) => p.id === id)
  if (!target) return { success: false }
  if (target.password && target.password !== password) {
    return { success: false, wrongPassword: true }
  }
  const nextPosts = posts.filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPosts))
  return { success: true }
}

/**
 * 방명록 섹션 컴포넌트입니다.
 * 최근 게시물을 표시하고, 작성/전체보기/삭제 기능을 제공합니다.
 * 백엔드 서버(SERVER_URL)가 있으면 API 통신을 하고, 없으면 로컬 스토리지를 통해 완벽히 동작합니다.
 * 다른 섹션과 한 페이지에 함께 담기 위해 카드 없이 내용만 렌더링합니다.
 *
 * @returns {JSX.Element} 방명록 섹션
 */
export const GuestBookSection = () => {
  const [posts, setPosts] = useState<Post[]>([])

  // 모달 상태 관리
  const guestbookListModalState = useState(false)
  const deleteGuestBookModalState = useState(false)
  const [deletePostId, setDeletePostId] = useState<number | null>(null)
  const writeGuestBookModalState = useState(false)

  /**
   * 서버 또는 로컬 저장소에서 방명록 게시물을 불러옵니다.
   */
  const loadPosts = async () => {
    if (SERVER_URL) {
      try {
        const res = await fetch(
          `${SERVER_URL}/guestbook?offset=${0}&limit=${3}`,
        )
        if (res.ok) {
          const data = await res.json()
          setPosts(data.posts)
          return
        }
      } catch (error) {
        console.error("Error loading posts from server:", error)
      }
    }
    // 서버가 없거나 요청 실패 시 로컬 스토리지 사용
    const local = getLocalPosts()
    setPosts(local.slice(0, 3))
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <>
      <section className="guestbook-section">
        <h2 className="english">Guest Book</h2>
        <p className="guestbook-subdesc">따뜻한 축하와 격려의 글을 남겨주세요</p>

        <div className="break" />

        {/* 게시물이 없을 때 */}
        {posts.length === 0 ? (
          <div className="empty-guestbook">
            <span className="empty-icon">💌</span>
            <p className="empty-text">아직 작성된 방명록이 없습니다.</p>
            <p className="empty-sub">소중한 첫 번째 축하 글을 남겨주세요!</p>
          </div>
        ) : (
          /* 게시물 목록 표시 (최대 3개 미리보기) */
          <div className="guestbook-posts-preview">
            {posts.map((post) => (
              <div key={post.id} className="post">
                <div className="heading">
                  <button
                    className="close-button"
                    title="방명록 삭제"
                    onClick={() => {
                      setDeletePostId(post.id)
                      deleteGuestBookModalState[1](true)
                    }}
                  />
                </div>
                <div className="body">
                  <div className="title">
                    <div className="name">{post.name}</div>
                    <div className="date">
                      {dayjs.unix(post.timestamp).format("YYYY-MM-DD")}
                    </div>
                  </div>
                  <div className="content">{post.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="break" />

        {/* 방명록 작성 버튼 */}
        <div className="guestbook-btn-group">
          <Button onClick={() => writeGuestBookModalState[1](true)}>
            방명록 작성하기
          </Button>
          <Button
            buttonStyle="style2"
            onClick={() => guestbookListModalState[1](true)}
          >
            방명록 전체보기
          </Button>
        </div>
      </section>

      {/* 방명록 전체보기 모달 */}
      <Modal
        modalState={guestbookListModalState}
        className="guestbook-list-modal"
        closeOnClickBackground={true}
      >
        <GuestBookListModal
          loadPosts={loadPosts}
          onClose={() => guestbookListModalState[1](false)}
        />
      </Modal>

      {/* 방명록 삭제 모달 */}
      <Modal
        modalState={deleteGuestBookModalState}
        className="delete-guestbook-modal"
        closeOnClickBackground={false}
      >
        <DeleteGuestBookModal
          postId={deletePostId}
          onSuccess={() => {
            deleteGuestBookModalState[1](false)
            loadPosts()
          }}
          onCancel={() => {
            deleteGuestBookModalState[1](false)
          }}
        />
      </Modal>

      {/* 방명록 작성 모달 */}
      <Modal
        modalState={writeGuestBookModalState}
        className="write-guestbook-modal"
        closeOnClickBackground={false}
      >
        <WriteGuestBookModal
          loadPosts={loadPosts}
          onClose={() => writeGuestBookModalState[1](false)}
        />
      </Modal>
    </>
  )
}

/**
 * 방명록 작성을 위한 모달 컴포넌트입니다.
 */
const WriteGuestBookModal = ({
  loadPosts,
  onClose,
}: {
  loadPosts: () => void
  onClose: () => void
}) => {
  const inputRef = useRef({}) as React.RefObject<{
    name: HTMLInputElement
    content: HTMLTextAreaElement
    password: HTMLInputElement
  }>
  const [loading, setLoading] = useState(false)

  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
          const name = inputRef.current.name.value.trim()
          const content = inputRef.current.content.value.trim()
          const password = inputRef.current.password.value

          // 유효성 검사
          if (!name) {
            alert("이름을 입력해주세요.")
            setLoading(false)
            return
          }
          if (name.length > RULES.name.maxLength) {
            alert(`이름을 ${RULES.name.maxLength}자 이하로 입력해주세요.`)
            setLoading(false)
            return
          }

          if (!content) {
            alert("내용을 입력해주세요.")
            setLoading(false)
            return
          }
          if (content.length > RULES.content.maxLength) {
            alert(`내용을 ${RULES.content.maxLength}자 이하로 입력해주세요.`)
            setLoading(false)
            return
          }

          if (password.length < RULES.password.minLength) {
            alert(`비밀번호를 ${RULES.password.minLength}자 이상 입력해주세요.`)
            setLoading(false)
            return
          }

          if (SERVER_URL) {
            // 서버에 데이터 전송
            const res = await fetch(`${SERVER_URL}/guestbook`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, content, password }),
            })
            if (!res.ok) {
              throw new Error(res.statusText)
            }
          } else {
            // 백엔드가 없을 때 로컬 스토리지에 저장
            saveLocalPost(name, content, password)
          }

          alert("방명록 작성이 완료되었습니다.")
          onClose()
          loadPosts()
        } catch {
          alert("방명록 작성에 실패했습니다.")
        } finally {
          setLoading(false)
        }
      }}
    >
      <div className="header">
        <div className="title-group">
          <div className="title">방명록 작성하기</div>
          <div className="subtitle">
            신랑, 신부에게 따뜻한 축하의 마음을 전해주세요.
          </div>
        </div>
      </div>
      <div className="content">
        <div className="form-group">
          <label className="field-label">작성자 성함</label>
          <input
            disabled={loading}
            type="text"
            placeholder="이름을 입력해주세요"
            ref={(ref) => {
              inputRef.current.name = ref as HTMLInputElement
            }}
            maxLength={RULES.name.maxLength}
          />
        </div>

        <div className="form-group">
          <label className="field-label">축하 메시지</label>
          <textarea
            disabled={loading}
            placeholder="축하 메시지를 100자 이내로 입력해주세요"
            ref={(ref) => {
              inputRef.current.content = ref as HTMLTextAreaElement
            }}
            maxLength={RULES.content.maxLength}
          />
        </div>

        <div className="form-group">
          <label className="field-label">삭제 비밀번호 (4자 이상)</label>
          <input
            disabled={loading}
            type="password"
            placeholder="추후 수정/삭제 시 사용할 비밀번호"
            ref={(ref) => {
              inputRef.current.password = ref as HTMLInputElement
            }}
            maxLength={RULES.password.maxLength}
          />
        </div>
      </div>
      <div className="footer">
        <Button buttonStyle="style2" disabled={loading} type="submit">
          {loading ? "저장 중..." : "축하 글 남기기"}
        </Button>
        <Button
          buttonStyle="style1"
          type="button"
          onClick={onClose}
        >
          닫기
        </Button>
      </div>
    </form>
  )
}

/**
 * 방명록 목록을 페이지네이션과 함께 표시하는 모달 컴포넌트입니다.
 */
const GuestBookListModal = ({
  loadPosts,
  onClose,
}: {
  loadPosts: () => Promise<void>
  onClose: () => void
}) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const deleteGuestBookModalState = useState(false)
  const [deletePostId, setDeletePostId] = useState<number | null>(null)

  const loadPage = useCallback(async (page: number) => {
    if (SERVER_URL) {
      try {
        const res = await fetch(
          `${SERVER_URL}/guestbook?offset=${page * POSTS_PER_PAGE}&limit=${POSTS_PER_PAGE}`,
        )
        if (res.ok) {
          const data = await res.json()
          setPosts(data.posts)
          setTotalPages(data.totalPages)
          return
        }
      } catch (error) {
        console.error("Error loading page from server:", error)
      }
    }

    // 서버 없을 때 로컬 스토리지
    const all = getLocalPosts()
    const total = Math.max(1, Math.ceil(all.length / POSTS_PER_PAGE))
    setTotalPages(total)
    const offset = page * POSTS_PER_PAGE
    setPosts(all.slice(offset, offset + POSTS_PER_PAGE))
  }, [])

  useEffect(() => {
    loadPage(currentPage)
  }, [currentPage, loadPage])

  const currentBlock = Math.floor(currentPage / PAGES_PER_BLOCK)

  const startPage = currentBlock * PAGES_PER_BLOCK
  const endPage = useMemo(() => {
    return Math.min(startPage + PAGES_PER_BLOCK, totalPages)
  }, [startPage, totalPages])

  const pages = useMemo(() => {
    return Array.from(
      { length: endPage - startPage },
      (_, index) => startPage + index,
    )
  }, [endPage, startPage])

  return (
    <>
      <div className="header">
        <div className="title-group">
          <div className="title">방명록 전체보기</div>
          <div className="subtitle">
            소중한 축하의 말씀을 남겨주셔서 감사합니다.
          </div>
        </div>
      </div>
      <div className="content">
        {posts.length === 0 ? (
          <div className="empty-guestbook">
            <p className="empty-text">작성된 방명록이 없습니다.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post">
              <div className="heading">
                <button
                  className="close-button"
                  title="삭제"
                  onClick={() => {
                    setDeletePostId(post.id)
                    deleteGuestBookModalState[1](true)
                  }}
                />
              </div>
              <div className="body">
                <div className="title">
                  <div className="name">{post.name}</div>
                  <div className="date">
                    {dayjs.unix(post.timestamp).format("YYYY-MM-DD")}
                  </div>
                </div>
                <div className="content">{post.content}</div>
              </div>
            </div>
          ))
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <Button
              className="page-button"
              disabled={startPage === 0}
              onClick={() => {
                setCurrentPage(startPage - 1)
              }}
            >
              &lt;
            </Button>
            {pages.map((page) => (
              <Button
                key={page}
                className={`page-button ${page === currentPage ? "current" : ""}`}
                onClick={() => {
                  setCurrentPage(page)
                }}
              >
                {page + 1}
              </Button>
            ))}
            <Button
              className="page-button"
              disabled={endPage === totalPages}
              onClick={() => {
                setCurrentPage(endPage)
              }}
            >
              &gt;
            </Button>
          </div>
        )}
      </div>

      <div className="footer">
        <Button buttonStyle="style1" type="button" onClick={onClose}>
          닫기
        </Button>
      </div>

      <Modal
        modalState={deleteGuestBookModalState}
        className="delete-guestbook-modal"
        closeOnClickBackground={false}
      >
        <DeleteGuestBookModal
          postId={deletePostId}
          onSuccess={() => {
            deleteGuestBookModalState[1](false)
            loadPosts()
            loadPage(currentPage)
          }}
          onCancel={() => {
            deleteGuestBookModalState[1](false)
          }}
        />
      </Modal>
    </>
  )
}

/**
 * 방명록 삭제를 위해 비밀번호를 입력받는 모달 컴포넌트입니다.
 */
const DeleteGuestBookModal = ({
  postId,
  onSuccess,
  onCancel,
}: {
  postId: number | null
  onSuccess: () => void
  onCancel: () => void
}) => {
  const inputRef = useRef({} as HTMLInputElement)
  const [loading, setLoading] = useState(false)

  if (postId === null) return null

  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
          const password = inputRef.current.value
          if (!password || password.length < RULES.password.minLength) {
            alert(`비밀번호를 ${RULES.password.minLength}자 이상 입력해주세요.`)
            setLoading(false)
            return
          }

          if (SERVER_URL) {
            // 서버에 삭제 요청 전송
            const result = await fetch(`${SERVER_URL}/guestbook`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: postId, password }),
            })

            if (!result.ok) {
              if (result.status === 403) {
                alert("비밀번호가 일치하지 않습니다.")
              } else {
                alert("방명록 삭제에 실패했습니다.")
              }
              return
            }
          } else {
            // 백엔드가 없을 때 로컬 스토리지에서 삭제
            const res = deleteLocalPost(postId, password)
            if (!res.success) {
              if (res.wrongPassword) {
                alert("비밀번호가 일치하지 않습니다.")
              } else {
                alert("방명록 삭제에 실패했습니다.")
              }
              return
            }
          }

          alert("삭제되었습니다.")
          onSuccess()
        } catch {
          alert("방명록 삭제에 실패했습니다.")
        } finally {
          setLoading(false)
        }
      }}
    >
      <div className="header">
        <div className="title">방명록 삭제</div>
        <div className="subtitle">
          작성 시 설정하셨던 비밀번호를 입력해주세요.
        </div>
      </div>
      <div className="content">
        <div className="form-group">
          <input
            disabled={loading}
            type="password"
            placeholder="비밀번호 입력"
            ref={inputRef}
            maxLength={RULES.password.maxLength}
            autoFocus
          />
        </div>
      </div>
      <div className="footer">
        <Button buttonStyle="style2" className="delete-submit-btn" disabled={loading} type="submit">
          {loading ? "삭제 중..." : "삭제하기"}
        </Button>
        <Button
          buttonStyle="style1"
          type="button"
          onClick={onCancel}
        >
          취소
        </Button>
      </div>
    </form>
  )
}
