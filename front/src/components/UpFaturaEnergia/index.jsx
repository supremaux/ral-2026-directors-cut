import React from "react";
import styles from "./UpFaturaEnergia.module.css";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { BsCloudUploadFill } from "react-icons/bs";
import { useContext, useState } from "react";
import { FormContext } from "../../FormContext";
import axios from "axios";

export default function UpFaturaEnergia() {
  const { formData, setFormData } = useContext(FormContext);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const data = new FormData();
    data.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload-fatura",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Atualizar o contexto com o link do arquivo
      setFormData({
        ...formData,
        termoAssinadoUrl: `http://localhost:3001${response.data.fileUrl}`,
      });

      alert("Arquivo enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      alert("Erro ao enviar arquivo.");
    }
  };

  return (
    <Container className="w-100 text-center d-flex flex-lg-row justify-content-center align-items-center">
      <Row>
        <Col>
          {/* Input Novo */}
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label className="small">
                Selecione fatura de energia elétrica
              </Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept=".pdf, .jpg, .png, .jpeg"
              />
            </Form.Group>
          </Form>
        </Col>
        <Col className="d-flex align-items-center justify-content-left">
          <Button
            onClick={handleUpload}
            htmlFor="file-upload"
            variant="primary"
            type="submit"
            id="uploadButton"
            className="btn btn-primary btn-lg md:btn-md"
          >
            <BsCloudUploadFill /> &nbsp; Enviar Fatura
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
