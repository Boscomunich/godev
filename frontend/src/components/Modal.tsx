import { SetStateAction, useState } from 'react';
import { Form, Input, Modal, Cascader } from 'antd';
import type { CascaderProps } from 'antd';

type ModalProps = {
    isModalOpen: boolean,
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>
    createProject: (name: string, language: string) => void,
}

type LanguageOption = {
    value: string;
    label: string;
}

type FieldType = {
    name?: string;
};

const languages: LanguageOption[] = [
    {
        value: 'nodejs',
        label: 'Nodejs',
    },
    {
        value: 'python',
        label: 'Python',
    }
]

const ModalComponent = ({isModalOpen, setIsModalOpen, createProject}: ModalProps) => {

    const [name, setName] = useState('')
    const [language, setLanguage] = useState('')

    const handleOk = () => {
        createProject(name, language)
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onChange: CascaderProps<LanguageOption>['onChange'] = (value) => {
        setLanguage(value[0]);
    };

    return (
        <>
        <Modal title="Create a Project" 
        open={isModalOpen} 
        onOk={handleOk}  
        onCancel={handleCancel}
        >
            <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 12 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: false }}
            autoComplete="off"
            preserve={false}
            onValuesChange={(changedValues) => {
                if (changedValues.name) {
                    setName(changedValues.name)
                }
            }}>
                <Form.Item<FieldType>
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input a project name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item 
                label="Language"
                name="language"
                rules={[{ required: true, message: 'Please select the desired language' }]}
                >
                    <Cascader 
                    options={languages} 
                    onChange={onChange} 
                    placeholder="Please select language" 
                    />
                </Form.Item>
            </Form>
        </Modal>
        </>
    );
};

export default ModalComponent;