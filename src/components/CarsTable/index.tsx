import React, { useEffect, useState } from "react";
import { getCars } from "../../api/CarsApi";
import type { Car, UpdatedCar } from "../../models/CarInterfaces";
import 'font-awesome/css/font-awesome.min.css';

// Table
import { Divider, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';

// Modal
import { Button, Modal } from 'antd';

// Form
import type { FormProps } from 'antd';
import { Form, Input } from 'antd';

const CarsTable: React.FC<{}> = () => {
    const columns: TableColumnsType<Car> = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Model',
            dataIndex: 'model',
        },
        {
            title: 'Year',
            dataIndex: 'year',
            sorter: (a, b) => a.year - b.year,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Options',
            render: (_, record: Car) => (
                <div className="options">
                    <Button type="link" className="options_item" onClick={startEditCar.bind(null, record)}>Редактировать</Button>
                    <Button type="link" className="options_item" onClick={deleteCar.bind(null, record)}>Удалить</Button>
                </div>
            )
        }
    ];

    // rowSelection object indicates the need for row selection
    const rowSelection: TableProps<Car>['rowSelection'] = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: Car[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record: Car) => ({
            name: record.name,
        }),
    };
    const [allCars, setAllCars] = useState<Car[]>([]);

    const [open, setOpen] = useState<boolean>(false);
    const [lastId, setLastId] = useState<number>(21);

    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const onFinish: FormProps['onFinish'] = (values) => {
        console.log('Success:', values);
        const tempRes = allCars;
        tempRes.push({ ...values, id: lastId, key: `${lastId}` });
        setLastId(lastId + 1);
        setAllCars(tempRes);
        setOpen(false);
    };

    const onFinishFailed: FormProps<UpdatedCar>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
        handleCancel();
    };

    const onFinishChange: FormProps['onFinish'] = (values) => {
        console.log(values);
        const updatedCars: Car[] = allCars.map<Car>((elem): Car => {
            return elem.id === values.id ? { ...elem, name: values.name, price: values.price } : elem;
        })
        console.log(updatedCars);

        setAllCars(updatedCars);
        setOpen(false);

        Modal.destroyAll()
    }

    const startEditCar = (car: Car) => {
        Modal.confirm({
            title: 'Форма обновления',
            closable: true,
            content: (
                <>
                    <Form
                        id="carsFormChange"
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinishChange}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<Car>
                            name="id"
                            initialValue={car.id}
                            hidden
                        >
                        </Form.Item>

                        <Form.Item<Car>
                            label="Марка"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                            initialValue={car.name}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<Car>
                            label="Стоимость"
                            name="price"
                            rules={[{ required: true, message: 'Please input your price!' }]}
                            initialValue={car.price}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </>
            ),
            footer: () => (
                <>
                    <Button form="carsFormChange" key="submit" htmlType="submit">
                        Обновить
                    </Button>
                </>
            ),
        });
    }

    const deleteCar = (car: Car) => {
        console.log('delete');
        setAllCars(allCars.filter((elem) => elem.id !== car.id))
    }

    const onChange: TableProps<Car>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    useEffect(() => {
        updateAndSetData();
    }, [])

    const updateAndSetData = () => {
        getCars().then((res: Car[]) => {
            setAllCars(res.map(obj => ({ ...obj, key: obj.id.toString() })));
        }).catch((error) => {
            alert(error)
        })
    }

    return (
        <div>
            <div>
                <div>
                    <Button type="primary" onClick={showModal}>
                        Add a car
                    </Button>
                    <Modal
                        title="Форма добавления"
                        open={open}
                        onCancel={handleCancel}
                        footer={[
                            <Button form="carsForm" key="submit" htmlType="submit">
                                Создать
                            </Button>
                        ]}
                    >
                        <Form
                            id="carsForm"
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item<UpdatedCar>
                                label="Марка"
                                name="name"
                                rules={[{ required: true, message: 'Please input your name!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<UpdatedCar>
                                label="Модель"
                                name="model"
                                rules={[{ required: true, message: 'Please input your model!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<UpdatedCar>
                                label="Год выпуска"
                                name="year"
                                rules={[{ required: true, message: 'Please input your year!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<UpdatedCar>
                                label="Цвет"
                                name="color"
                                rules={[{ required: true, message: 'Please input your color!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<UpdatedCar>
                                label="Стоимость"
                                name="price"
                                rules={[{ required: true, message: 'Please input your price!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
                <Divider />
                <Table<Car>
                    rowSelection={{ type: 'checkbox', ...rowSelection }}
                    columns={columns}
                    dataSource={allCars}
                    onChange={onChange}
                    showSorterTooltip={{ target: 'sorter-icon' }}
                />
            </div>
        </div>
    )
}

export default CarsTable;