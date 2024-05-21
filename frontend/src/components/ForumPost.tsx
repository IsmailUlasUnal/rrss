import {PostDto} from "@/lib/dto";
import {useEffect, useState} from "react";
import axios from "axios";
import {baseURL} from "@/lib/const";
import {errorHandler} from "@/lib/utils";
import {Avatar, Button, Card, Col, Row} from "antd";
import {CloseCircleOutlined, UserOutlined} from "@ant-design/icons";
import {Roles} from "@/lib/enums";

export function ForumPost(props: {
    onClick: () => Promise<void>,
    disabled: boolean,
    post: PostDto,
}) {
    const [image, setImage] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    const getImage = async () => {
        setLoading(true)
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`${baseURL}/users/picture/${props.post.userDto.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer',
            });

            const imageBlob = new Blob([response.data], {type: 'image/png'});
            const imageUrl = URL.createObjectURL(imageBlob);
            setImage(imageUrl);
        } catch (error) {
            const errorMessage = errorHandler(error, 'Error fetching images');
            console.log(errorMessage);
        }
        setLoading(false);
    };

    useEffect(() => {
        getImage();
    }, []);

    return <Card style={{marginBottom: 12, minHeight: 60}}>
        <Button
            style={{position: "absolute", top: 8, right: 8, backgroundColor: "transparent", border: "none"}}
            icon={<CloseCircleOutlined style={{color: "red"}}/>}
            onClick={props.onClick}
            disabled={props.disabled}
            hidden={!((role === Roles.ADMIN || role === Roles.COMMUNITY_MODERATOR) || props.post.userDto.username === username)}
        />
        <Row gutter={16}>
            <Col span={5}>
                <Card style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "lightyellow"
                }}>
                    <Row>
                        <div style={{padding: 4, textAlign: "center"}}>
                            <Avatar size={64} src={props.post.userDto.username === "Anonymous" ? undefined : image} icon={<UserOutlined/>}/>
                            <p>{props.post.userDto.username}</p>
                            <p>{new Date(props.post.creationDate).toLocaleDateString()}</p>
                        </div>
                    </Row>
                </Card>
            </Col>
            <Col span={14}>
                <p>{props.post.content}</p>
            </Col>
        </Row>
    </Card>;
}