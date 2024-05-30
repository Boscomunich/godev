import React, { SetStateAction, useState } from 'react';
import { FormProps , Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { url } from '../Constant';
import useSignIn from 'react-auth-kit/hooks/useSignIn';

type FieldType = {
    email?: string;
    password?: string;
    remember?: boolean;
};

type SignUpProps = {
  setFormType: React.Dispatch<SetStateAction<string>>; // Type the setter function
}

const SignIn = ({setFormType}: SignUpProps) => {

    const navigate = useNavigate()
    const signIn = useSignIn();
    const [messageApi, contextHolder] = message.useMessage();
    const [loadings, setLoadings] = useState<boolean[]>([]);

    const error = (msg: string) => {
        messageApi.open({
        type: 'error',
            content: msg,
        });
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try { 
            const response = await fetch(`${url}/api/user/login`,{
                method: 'post',
                headers:{'content-type': 'application/json'},
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                body: JSON.stringify({
                    email: values.email,
                    password: values.password
                })
            })
            const res = await response.json()
            console.log(res)
                if (response.ok) {
                    signIn({
                        auth: {
                            token: res.token,
                            type: 'Bearer'
                        },
                        userState: {
                            email: res.email,
                            id: res.id
                        }
                    })
                    navigate('/dashboard')
                } else {
                    error(res)
                }
            }
                catch (err) {
                    error('server error')
            }finally {
                setLoadings([])
            }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        error(errorInfo.errorFields[0].errors[0])
        setLoadings([])
    }

    const enterLoading = (index: number) => {
        setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = true;
        return newLoadings;
        });

        setTimeout(() => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = false;
            return newLoadings;
        });
        }, 6000);
    };

    return(
    <>
    {contextHolder}
    <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 12 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: false }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
    preserve={false}>
        <h1 className='text-center text-3xl font-bold my-10'>
            Log in to your Account
        </h1>
        <Form.Item<FieldType>
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your Email!' }]}
        >
        <Input />
        </Form.Item>

        <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
        >
        <Input.Password />
        </Form.Item>
            <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
            className='w-[70%] pl-20'
            >
            <Checkbox>Remember me</Checkbox>
            </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit"
        loading={loadings[0]} onClick={() => enterLoading(0)}>
            Submit
        </Button>
        </Form.Item>
        <div className='flex justify-center'>
            <div className='w-[40%] pl-5 pt-1 font-[400]'>
                <span className='font-[400]'>
                    new to goDev?
                </span>
                <button className='text-blue-500'
                onClick={() => setFormType('signup')}>
                    Signup
                </button>
            </div>
        </div>
    </Form>
    </>
    )
};

export default SignIn;