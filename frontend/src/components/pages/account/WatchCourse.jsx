import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { Accordion, ProgressBar } from 'react-bootstrap'
import { MdSlowMotionVideo } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import { apiUrl, token } from '../../common/Config'
import axios from 'axios'
import ReactPlayer from 'react-player' // Recommended for better compatibility

const WatchCourse = () => {
    // 1. Initialize as null, not []
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const params = useParams();


    const showLesson = async (lesson) => {
        setActiveLesson(lesson);
        const data = {
            lesson_id :lesson.id,
            chapter_id:lesson.chapter_id,
            course_id:params.id,
        }
        try {
            const res = await axios.post(`${apiUrl}/save-activity`,data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                }
            });

            if (res.status === 200) {
                console.log('activity saved')
            }
        } catch (error) {
            console.error("Error fetching course data:", error.response?.data || error.message);
        }
    };

    const enrollCourse = async () => {
        try {
            const res = await axios.get(`${apiUrl}/enroll/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (res.status === 200) {
                setCourse(res.data.course);
                setActiveLesson(res.data.activitylesson);
            }
        } catch (error) {
            console.error("Error fetching course data:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        enrollCourse();
    }, [params.id]);

    // 2. Prevent rendering until data is loaded
    if (!course || !activeLesson) {
        return (
            <Layout>
                <div className="container my-5 text-center">
                    <h4>Loading course content...</h4>
                </div>
            </Layout>
        );
    }

    // 3. Construct the Video URL safely
    const videoUrl = `${apiUrl.replace("/api", "")}/uploads/lesson/videos/${activeLesson.video}`;

    return (
        <Layout>
            <section className='section-5 my-5'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-8'>
                            <div className='video-player-wrapper mb-4' style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
                                <ReactPlayer
                                    key={activeLesson.id} // Forces reload when switching lessons
                                    src={videoUrl}
                                    width='100%'
                                    height='100%'
                                    controls={true}
                                    playing={true}
                                    muted={true} // Helps bypass browser autoplay blocks
                                    style={{ position: 'absolute', top: 0, left: 0 }}
                                />
                            </div>
                            <div className='meta-content'>
                                <div className='d-flex justify-content-between align-items-center border-bottom pb-2 mb-3'>
                                    <h3 className='pt-2'>{activeLesson.title}</h3>
                                    <button className='btn btn-primary px-3'>
                                        Mark as complete <IoMdCheckmarkCircleOutline size={20} />
                                    </button>
                                </div>
                                <div className='lesson-description'>
                                    <div dangerouslySetInnerHTML={{ __html: activeLesson.description }} />
                                </div>
                            </div>
                        </div>

                        <div className='col-md-4'>
                            <div className='card rounded-0 shadow-sm'>
                                <div className='card-body'>
                                    <div className='h6'><strong>{course.title}</strong></div>
                                    <div className='py-2'>
                                        <ProgressBar now={0} variant="success" />
                                        <div className='pt-2 small'>0% complete</div>
                                    </div>
                                    <Accordion flush defaultActiveKey={activeLesson.chapter_id}>
                                        {course.chapters?.map((chapter) => (
                                            <Accordion.Item eventKey={chapter.id} key={chapter.id}>
                                                <Accordion.Header><strong>{chapter.title}</strong></Accordion.Header>
                                                <Accordion.Body className='p-0'>
                                                    <ul className='list-group list-group-flush'>
                                                        {chapter.lessons?.map((lesson) => (
                                                            <li 
                                                                key={lesson.id}
                                                                className={`list-group-item list-group-item-action border-0 ${activeLesson.id === lesson.id ? 'bg-light text-primary' : ''}`}
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => showLesson(lesson)}
                                                            >
                                                                <MdSlowMotionVideo size={18} className="me-2" />
                                                                {lesson.title}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default WatchCourse;