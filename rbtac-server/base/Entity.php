<?php
include_once "BaseEntity.php";
include_once "AddEntity.php";
include_once "UpdateEntity.php";
include_once "DeleteEntity.php";
include_once "ListEntity.php";
include_once "GetEntity.php";

class Entity
{
    private $db;
    private $addEntity;
    private $updateEntity;
    private $deleteEntity;
    private $listEntity;
    private $getEntity;

    public function __construct($db)
    {
        $this->db = $db;
        $this->addEntity = new AddEntity($db);
        $this->updateEntity = new UpdateEntity($db);
        $this->deleteEntity = new DeleteEntity($db);
        $this->listEntity = new ListEntity($db);
        $this->getEntity = new GetEntity($db);
    }

    public function save($entity, $data)
    {
        return isset($data['id']) ?
            $this->updateEntity->execute(
                $entity,
                $data,
                ['id' => $data['id']]
            ) : $this->addEntity->execute($entity, $data);
    }

    public function delete($entity, $id)
    {
        return $this->deleteEntity->execute($entity, $id);
    }

    public function list(
        $entity,
        $filters = [],
        $search = null,
        $orderBy = "created_at",
        $direction = "DESC",
        $page = 1,
        $limit = 30
    ) {
        return $this->listEntity->execute(
            $entity,
            $filters,
            $search,
            $orderBy,
            $direction,
            $page,
            $limit
        );
    }

    public function getById($entity, $id)
    {
        return $this->getEntity->execute($entity, $id);
    }
}
