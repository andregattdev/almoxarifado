package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Peca {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "peca_seq")
    @SequenceGenerator(name = "peca_seq", sequenceName = "peca_seq", allocationSize = 1)
    private Long id;

    @NotBlank
    private String nomePeca;

    private String codigo;

    private String descricaoPeca;

    private Integer estoque;

    @Valid
    @OneToMany(mappedBy = "peca", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("peca")
    private List<Especificacao> especificacoes;

    @Valid
    @OneToMany(mappedBy = "peca", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("peca")
    private List<Lote> lotes;

    @JsonSetter(nulls = Nulls.SKIP)
    private Boolean ativo = true;

    public Peca() {
    }

    public Peca(Long id, String nomePeca, String codigo, String descricaoPeca, Integer estoque,
            List<Especificacao> especificacoes, List<Lote> lotes, Boolean ativo) {
        this.id = id;
        this.nomePeca = nomePeca;
        this.codigo = codigo;
        this.descricaoPeca = descricaoPeca;
        this.estoque = estoque;
        this.especificacoes = especificacoes;
        this.lotes = lotes;
        this.ativo = ativo != null ? ativo : true;
    }

    public void vincularRelacionamentos() {
        if (especificacoes != null) {
            for (Especificacao especificacao : especificacoes) {
                especificacao.setPeca(this);
                if (especificacao.getAtivo() == null) {
                    especificacao.setAtivo(true);
                }
            }
        }
        if (lotes != null) {
            for (Lote lote : lotes) {
                lote.setPeca(this);
                if (lote.getAtivo() == null) {
                    lote.setAtivo(true);
                }
            }
        }
        if (ativo == null) {
            ativo = true;
        }
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomePeca() {
        return this.nomePeca;
    }

    public void setNomePeca(String nomePeca) {
        this.nomePeca = nomePeca;
    }

    public String getCodigo() {
        return this.codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDescricaoPeca() {
        return this.descricaoPeca;
    }

    public void setDescricaoPeca(String descricaoPeca) {
        this.descricaoPeca = descricaoPeca;
    }

    public Integer getEstoque() {
        return this.estoque;
    }

    public void setEstoque(Integer estoque) {
        this.estoque = estoque;
    }

    public List<Especificacao> getEspecificacoes() {
        return this.especificacoes;
    }

    public void setEspecificacoes(List<Especificacao> especificacoes) {
        this.especificacoes = especificacoes;
    }

    public List<Lote> getLotes() {
        return this.lotes;
    }

    public void setLotes(List<Lote> lotes) {
        this.lotes = lotes;
    }

    public Boolean getAtivo() {
        return this.ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo != null ? ativo : true;
    }
}
